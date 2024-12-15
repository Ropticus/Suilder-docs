# Operators

## Comparison operators
```csharp
IOperator op1 = sql.Eq(person["Id"], 1);
IOperator op2 = sql.Eq(() => person.Id, 1);

// SqlExtensions
IOperator op3 = person["Id"].Eq(1);
IOperator op4 = sql.Col(() => person.Id).Eq(1);

// Lambda expression
IOperator op5 = sql.Op(() => person.Id == 1);
```

## Logical operators
```csharp
IOperator op1 = sql.And
    .Add(sql.Eq(person["Active"], true))
    .Add(sql.Ge(person["Salary"], 2000));

// Lambda overload
IOperator op2 = sql.Or
    .Add(() => person.Active)
    .Add(() => person.Salary >= 2000);

// Lambda expression
IOperator op3 = sql.Op(() => person.Active && person.Salary >= 2000);
```

## Arithmetic operators
```csharp
IOperator op1 = sql.Add
    .Add(person["Salary"])
    .Add(200);

// Lambda overload
IOperator op2 = sql.Add
    .Add(() => person.Salary)
    .Add(200);

// Lambda expression
// Because is not a boolean result must call "Val" instead of "Op"
IOperator op3 = sql.Val(() => person.Salary + 200);
```

## Bitwise operators
```csharp
IOperator op1 = sql.BitAnd
    .Add(2)
    .Add(3);

// Lambda overload
IOperator op2 = sql.Add
    .Add(() => 2)
    .Add(3);

// Lambda expression
// Because is not a boolean result must call "Val" instead of "Op"
IOperator op3 = sql.Val(() => 2 & 3);
```

## Set operators
```csharp
IOperator op = sql.Union(
    sql.Query.Select(() => person.Name).From(() => person),
    sql.Query.Select(() => dept.Name).From(() => dept));
```

## List of operators
The following list shows the implemented operators:

| SQL | ISqlBuilder | Extensions[^1] | Expressions | SqlExp |
|-----|-------------|----------------|-------------|--------|
| **=** | Eq | Eq | == | Eq |
| **<>** | NotEq | NotEq | != | NotEq |
| **LIKE** | Like | Like | Like[^2] | Like |
| **NOT LIKE** | NotLike | NotLike | NotLike[^2] | NotLike |
| **<** | Lt | Lt | < | Lt |
| **<=** | Le | Le | <= | Le |
| **>** | Gt | Gt | > | Gt |
| **>=** | Ge | Ge | >= | Ge |
| **IN** | In | In | In[^3] | In |
| **NOT IN** | NotIn | NotIn | NotIn[^3] | NotIn |
| **NOT** | Not | Not | ! | Not |
| **IS NULL** | IsNull<br>Eq(null) | IsNull<br>Eq(null) | == null | IsNull<br>Eq(null) |
| **IS NOT NULL** | IsNotNull<br>NotEq(null) | IsNotNull<br>NotEq(null) | != null | IsNotNull<br>NotEq(null) |
| **BETWEEN** | Between | Between | | Between |
| **NOT BETWEEN** | NotBetween | NotBetween | | NotBetween |
| **AND** | And | | &&<br>& | |
| **OR** | Or | | &#124;&#124;<br>&#124; | |
| **+** | Add | Plus | + | |
| **-** | Subtract | Minus | - | |
| **\*** | Multiply | Multiply | * | |
| **/** | Divide | Divide | / | |
| **%** | Modulo | Modulo | % | |
| **+ (Positive)**  | | | + | |
| **- (Negative)**  | Negate | Negate | - | |
| **&** | BitAnd | BitAnd | & | |
| **&#124;** | BitOr | BitOr | &#124; | |
| **^** | BitXor | BitXor | ^ | |
| **~** | BitNot | BitNot | ~ | |
| **<<** | LeftShift | LeftShift | << | |
| **>>** | RightShift | RightShift | >> | |
| **ALL** | All | | | All |
| **ANY** | Any | | | Any |
| **EXISTS** | Exists | | | Exists |
| **SOME** | Some | | | Some |
| **UNION** | Union | | | |
| **UNION ALL** | UnionAll | | | |
| **EXCEPT** | Except | | | |
| **EXCEPT ALL** | ExceptAll | | | |
| **INTERSECT** | Intersect | | | |
| **INTERSECT ALL** | IntersectAll | | | |
| **CASE** | | | ?: | |
| **COALESCE()** | | | ?? | |
| **CONCAT()** | | | + | |

[^1]: Extension methods for `IQueryFragment`.
[^2]: Extension method for `String`.
[^3]: Extension method for `IEnumerable`.

## Like pattern
You can use the following methods to apply a like pattern:

| Pattern | ISqlBuilder | Extensions[^4] |
|-------------|----------------|---------|
| Value% | ToLikeStart | ToLikeStart |
| %Value | ToLikeEnd | ToLikeEnd |
| %Value% | ToLikeAny | ToLikeAny |

[^4]: Extension methods for `String`.

```csharp
IAlias person = sql.Alias("person");
IOperator op = person["Name"].Like(sql.ToLikeAny("SomeName"));

// Extension method
IOperator op = person["Name"].Like("SomeName".ToLikeAny());
```

## Register operators

### In your engine
You can register your operators in your [engine](../configuration/engines.md#register-operators) to translate them with a different name or into a function.