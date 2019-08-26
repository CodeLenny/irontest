---
uid: guide-copy-test
---
# Re-Running Tests

Iron Test's standard [dependency](xref:guide-dependencies) system can handle a graph of dependent tests,
but only runs each test once.

This may handle most use cases, but sometimes you may want to re-run tests and test setup methods.

For instance, you may want to ensure that you have a clean user to test different authentication tests.
We'll use this as an example in the following sections.

## Duplicating Tests

You've got great authentication tests for the initial login via OAuth:

![Diagram of OAuth test](../diagrams/out/guide/repeat-test/oauth-login.png)

You've just implemented SAML login.
`firstLoginDate` should still be populated on the user's first login, even if it's via SAML.

OK, you can just copy the OAuth test:

![Diagram of duplicated OAuth test](../diagrams/out/guide/repeat-test/oauth-saml-copy-file.dot)

That works.
But hang on, almost all of that file is the same.  Let's use [dependencies](xref:guide-dependencies) to deduplicate the code.



```typescript
const api = new ServerAPI();

@TestClass()
class TestInitialOAuthLogin {

    @Test()
    public static createUserPassword(): UserPassword {
        return api.createNewUserPassword("passWORD");
    }

    @Test()
    public static createUser(
        @TestOutput(TestInitialOAuthLogin.createUserPassword) password: UserPassword,
    ): User {
        return api.createUser("admin", password);
    }

    @Test()
    public static testOAuthLogin(
        @TestOutput(TestInitialOAuthLogin.createUser): User,
    ) {
        // Do OAuth magic, using User.username & User.password
    }

    @Test()
    @TestDependsOn(TestInitialOAuthLogin.testOAuthLogin)
    public static updatesFirstLoginDate(
        @Asserts() assert: Assert,
        @TestOutput(TestInitialOAuthLogin.createUser) user: User,
    ) {
        const user = api.getUser(user);
        assert.false(user.firstLoginDate !== null);
    }

    @Test()
    @TestDependsOn(TestInitialOAuthLogin.updatesFirstLoginDate)
    public static deleteUser(
        @TestOutput(TestInitialOAuthLogin.createUser) user: User,
    ) {
        api.deleteUser(user);
    }

    @Test()
    @TestDependsOn(TestInitialOAuthLogin.deleteUser)
    public static deleteUserPassword(
        @TestOutput(TestInitialOAuthLogin.createUser) user: User,
    ) {
        api.deleteUserPassword(user.getPassword());
    }

}
```

While the above code would work, it would be nicer if the methods to create and delete users was reusable, but re-ran each time so `firstLoginDate` was reset.

## Create 







```typescript
// CreateUserPassword.ts
@TestClass()
export class CreateUserPassword {

    @Test()
    public static createUserPassword(): UserPassword {
    }

    @Test()
    public static createUserPassword(
        userPassword: UserPassword,
    ) {
    }

}
```

```typescript
// CreateUser.ts
@TestClass()
export class CreateUser {

    @Test()
    public static createUser(): User {
    }

    @Test()
    public static deleteUser(
        user: User,
    ) {
    }

}
```

