# 密码哈希与登录验证开发文档

## 1. 任务目标

当前后端已经完成了 REST API 和 MySQL 数据库连接，前端也可以通过 API 查询房间、登录用户、创建和管理预约。

新的开发任务是：把用户密码从明文存储改为安全的哈希存储，并在登录时验证用户输入的密码是否正确。

也就是说，后端不能再直接保存或比较用户的原始密码，而是应该：

- 用户注册或创建账号时，把密码先转换成哈希值，再保存到数据库；
- 用户登录时，用用户输入的密码和数据库中的哈希值进行比较；
- 密码正确才允许登录；
- 密码错误、空密码、账号不存在时返回登录失败。

这个任务主要属于后端安全功能，也会涉及前端登录表单和数据库现有数据的处理。

## 2. 为什么不能存明文密码

如果数据库里直接保存 `123456` 这种明文密码，一旦数据库泄露，所有用户的真实密码都会被直接看到。

使用密码哈希之后，数据库中保存的是类似下面这样的字符串：

```text
$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

这个值不能直接还原成原始密码。登录时，后端会用 bcrypt 提供的比较函数判断“用户输入的密码”和“数据库中的哈希值”是否匹配。

这样即使数据库泄露，攻击者也不能直接看到用户原始密码。

## 3. 技术选择

本项目后端使用的是 NestJS，也就是基于 Node.js 和 TypeScript 的后端框架。

本任务建议使用 `bcrypt` 处理密码哈希，因为它是 Web 后端中非常常见的密码加密/验证方案，适合存储用户密码。

需要安装的依赖：

```bash
npm install bcrypt
npm install --save-dev @types/bcrypt
```

其中：

- `bcrypt`：实际用于生成哈希和验证密码；
- `@types/bcrypt`：给 TypeScript 提供类型声明，避免编译时报类型错误。

## 4. 当前项目现状

根据现在的项目结构，后端认证逻辑主要在：

```text
backend/src/auth/auth.service.ts
backend/src/auth/auth.controller.ts
backend/src/auth/dto/login.dto.ts
```

目前登录流程大致是：

1. 前端发送 email 到后端；
2. 后端根据 email 查询 MySQL 的 `user` 表；
3. 如果用户存在，就把用户信息返回给前端；
4. 前端根据返回的用户角色展示不同页面。

这个流程目前还不是真正的密码登录，因为它没有检查用户密码。

因此本次任务需要把登录流程改成：

1. 前端发送 email 和 password；
2. 后端检查 email 和 password 是否为空；
3. 后端根据 email 查询用户；
4. 后端使用 `bcrypt.compare()` 验证密码；
5. 密码正确，返回用户信息；
6. 密码错误，返回 `401 Unauthorized`；
7. 账号不存在，也返回登录失败。

## 5. 后端需要修改的内容

### 5.1 修改登录 DTO

文件：

```text
backend/src/auth/dto/login.dto.ts
```

当前登录 DTO 可能只有 email，需要增加 password 字段。

目标结构：

```ts
export class LoginDto {
  email!: string;
  password!: string;
}
```

这样前端登录时必须把邮箱和密码一起传给后端。

### 5.2 修改 AuthService 登录逻辑

文件：

```text
backend/src/auth/auth.service.ts
```

需要引入 bcrypt：

```ts
import * as bcrypt from 'bcrypt';
```

登录时增加以下逻辑：

- 如果没有 email，返回 `BadRequestException`；
- 如果没有 password，返回 `BadRequestException`；
- 如果数据库中找不到用户，返回 `UnauthorizedException`；
- 如果密码验证失败，返回 `UnauthorizedException`；
- 如果密码验证成功，返回前端需要的用户信息。

核心逻辑示例：

```ts
const isPasswordValid = await bcrypt.compare(
  loginDto.password,
  normalizedHash,
);

if (!isPasswordValid) {
  throw new UnauthorizedException('Invalid credentials');
}
```

这里建议不要返回“邮箱不存在”或“密码错误”这种过于具体的信息，因为这样会暴露账号是否存在。统一返回 `Invalid credentials` 更安全。

### 5.3 兼容旧数据库中的 bcrypt 格式

项目中有一部分老数据库数据可能来自 PHP 或其他后端。

PHP bcrypt 哈希经常以 `$2y$` 开头，而 Node.js 的 bcrypt 更常见的是 `$2b$`。

为了兼容旧数据，可以在比较前做一次格式转换：

```ts
private normalizeBcryptHash(hash: string): string {
  if (hash.startsWith('$2y$')) {
    return `$2b$${hash.slice(4)}`;
  }

  return hash;
}
```

这样旧数据库中的 `$2y$` 哈希也可以被 Node.js bcrypt 正常验证。

## 6. 注册和创建用户时的密码处理

如果后端之后要实现真正的注册接口，例如：

```text
POST /api/auth/register
```

或者管理员创建用户接口，例如：

```text
POST /api/users
```

那么保存用户之前必须先 hash 密码。

示例：

```ts
const saltOrRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltOrRounds);
```

然后数据库中保存的是：

```ts
password: hashedPassword
```

而不是：

```ts
password: password
```

目前项目重点是登录验证，如果注册功能还没有实现，可以先只完成登录验证和数据库迁移。之后如果加注册接口，再复用同一个 hash 方法。

## 7. 数据库现有用户的处理

这是本任务最容易出问题的地方。

因为数据库里已经有一些用户数据。如果这些用户的密码还是明文，例如：

```text
123456
demo-password-not-hashed
```

那么后端改成 `bcrypt.compare()` 之后，这些明文密码会无法通过验证。

所以不能只改代码，还必须处理已有数据库数据。

建议方案：写一个小迁移脚本或手动 SQL 更新，把明文密码转换成 bcrypt 哈希。

处理规则：

- 如果密码已经以 `$2a$`、`$2b$` 或 `$2y$` 开头，说明它已经是 bcrypt 哈希，不需要重复处理；
- 如果不是这些开头，说明可能是明文，需要使用 bcrypt hash 后再保存；
- 处理完成后，数据库中不应该再出现明文密码。

示例判断逻辑：

```ts
function isBcryptHash(password: string): boolean {
  return password.startsWith('$2a$')
    || password.startsWith('$2b$')
    || password.startsWith('$2y$');
}
```

## 8. Demo 用户密码建议

当前项目中有测试账号：

```text
b@gamingrooms.fr
a@gamingrooms.fr
j@gamingrooms.fr
```

建议给这三个 demo 账号设置同一个已知测试密码，例如：

```text
demo123
```

数据库中不要保存 `demo123` 明文，而是保存它的 bcrypt 哈希。

这样前端登录页可以写清楚：

```text
Demo: b@gamingrooms.fr, a@gamingrooms.fr ou j@gamingrooms.fr
Mot de passe: demo123
```

登录测试时：

- 输入正确邮箱 + `demo123`：登录成功；
- 输入正确邮箱 + 错误密码：登录失败；
- 输入不存在的邮箱：登录失败。

## 9. 前端需要修改的内容

虽然这个任务主要是后端安全功能，但前端登录页也需要配合修改。

当前前端如果只发送 email，后端无法验证密码。

因此需要修改：

```text
frontend/src/app/core/services/auth.service.ts
frontend/src/app/features/login/login.component.ts
frontend/src/app/features/login/login.component.html
```

需要完成：

- 登录表单增加 password 输入框；
- `AuthService.login()` 方法从只接收 email 改成接收 email + password；
- HTTP 请求 body 从：

```ts
{ email }
```

改成：

```ts
{ email, password }
```

请求示例：

```ts
this.http.post<User>(`${API_BASE_URL}/auth/login`, {
  email,
  password,
});
```

## 10. REST API 行为变化

本次任务主要影响登录接口。

### POST /api/auth/login

请求体：

```json
{
  "email": "b@gamingrooms.fr",
  "password": "demo123"
}
```

成功响应：

```json
{
  "id": 58,
  "email": "b@gamingrooms.fr",
  "role": "client",
  "displayName": "..."
}
```

失败情况：

| 情况 | HTTP 状态码 | 说明 |
|---|---:|---|
| email 为空 | 400 | 请求格式不完整 |
| password 为空 | 400 | 请求格式不完整 |
| 用户不存在 | 401 | 登录失败 |
| 密码错误 | 401 | 登录失败 |

建议错误信息统一使用：

```text
Invalid credentials
```

## 11. 测试计划

### 11.1 后端编译测试

进入后端目录：

```bash
cd backend
npm run build
```

目标：确认 TypeScript 编译没有错误。

### 11.2 后端自动测试

如果项目中已有测试：

```bash
npm test
npm run test:e2e
```

目标：确认原有 API 没有被破坏。

### 11.3 手动测试登录成功

请求：

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"b@gamingrooms.fr\",\"password\":\"demo123\"}"
```

预期结果：

- 返回用户信息；
- HTTP 状态码是 201 或 200，具体取决于 NestJS controller 当前配置；
- 前端可以正常进入登录后的页面。

### 11.4 手动测试密码错误

请求：

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"b@gamingrooms.fr\",\"password\":\"wrong-password\"}"
```

预期结果：

- 返回 `401 Unauthorized`；
- 前端显示登录失败；
- 用户不能进入受保护页面。

### 11.5 手动测试空密码

请求：

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"b@gamingrooms.fr\"}"
```

预期结果：

- 返回 `400 Bad Request`；
- 后端不会尝试登录。

### 11.6 前端构建测试

进入前端目录：

```bash
cd frontend
npm run build
```

目标：确认 Angular 修改后可以正常编译。

## 12. 完成后的效果

完成本任务后，项目登录逻辑会从“只根据邮箱识别用户”升级为“邮箱 + 密码验证”。

具体变化：

- 数据库中不再保存明文密码；
- 登录接口会真实验证密码；
- 错误密码无法登录；
- 旧的 PHP bcrypt 哈希可以兼容；
- demo 账号可以继续用于测试；
- 前端登录页可以输入密码；
- 后端安全性更符合真实 Web 项目的要求。

## 13. 推荐实施顺序

建议按照下面顺序开发：

1. 安装 `bcrypt` 和 `@types/bcrypt`；
2. 修改 `LoginDto`，增加 `password`；
3. 修改 `AuthService`，加入密码检查和 bcrypt 验证；
4. 增加 `$2y$` 到 `$2b$` 的兼容处理；
5. 修改前端登录表单，增加密码输入框；
6. 修改前端 `AuthService.login()`，发送 email + password；
7. 处理数据库现有明文密码；
8. 更新 SQL dump 文件，确保队友导入数据库后也能登录；
9. 运行后端 build/test；
10. 运行前端 build；
11. 手动测试正确密码、错误密码、空密码三种情况。

## 14. 需要和队友确认的点

在正式实现前，建议和队友确认：

- Demo 账号统一使用什么密码，例如是否使用 `demo123`；
- 是否现在就要实现注册接口；
- 是否需要管理员创建用户接口；
- 旧数据库中已有用户的原始密码是否还需要保留登录能力；
- SQL 文件是否需要同步更新到 GitHub，方便其他成员重建数据库。

如果只是完成当前任务，最小可交付版本是：

- 登录接口支持 password；
- 数据库 demo 用户密码已 hash；
- 前端登录页可以输入密码；
- 正确密码能登录，错误密码不能登录。

