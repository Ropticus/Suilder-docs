# Operators
Comparison operators:

```csharp
IOperator op1 = sql.Eq(person["Id"], 1);
IOperator op2 = sql.Eq(() => person.Id, 1);

// SqlExtensions
IOperator op3 = person["Id"].Eq(1);
IOperator op4 = sql.Col(() => person.Id).Eq(1);

// Lambda expression
IOperator op5 = sql.Op(() => person.Id == 1);
```

Logical operatorss:
```csharp
IOperator op1 = sql.And
    .Add(sql.Eq(person["Active"], true))
    .Add(sql.Ge(person["Salary"], 2000));

// Lambda overload
IOperator op2 = sql.Or
    .Add(() => person.Active))
    .Add(() => person.Salary >= 2000));

// Lambda expression
IOperator op3 = sql.Op(() => person.Active && person.Salary >= 2000);
```

Arithmetic operators:
```csharp
IOperator op1 = sql.Add
    .Add(person["Salary"])
    .Add(200);

// Lambda overload
IOperator op2 = sql.Add
    .Add(() => person.Salary))
    .Add(200);

// Lambda expression
// Because is not a boolean result must call "Val" instead of "Op"
IOperator op3 = sql.Val(() => person.Salary + 200);
```

Bitwise operators:
```csharp
IOperator op1 = sql.BitAnd
    .Add(2)
    .Add(3);

// Lambda overload
IOperator op2 = sql.Add
    .Add(() => 2))
    .Add(3);

// Lambda expression
// Because is not a boolean result must call "Val" instead of "Op"
IOperator op3 = sql.Val(() => 2 & 3);
```

Query operators:
```csharp
IOperator op = sql.Union(
    sql.Query.Select(() => person.Name).From(() => person),
    sql.Query.Select(() => dept.Name).From(() => dept));
```

## List of operators
The following list shows the implemented operators:

SQL operator | ISqlBuilder | SqlExp | Expressions |
-------------|-------------|--------|-------------|
**=** | Eq <sup>(1)</sup>| Eq | == |
**<>** | NotEq <sup>(1)</sup>| NotEq | != |
**LIKE** | Like <sup>(1)</sup>| Like | Like <sup>(2)</sup> |
**NOT LIKE** | NotLike <sup>(1)</sup>| NotLike | NotLike <sup>(2)</sup> |
**<** | Lt <sup>(1)</sup>| Lt | < |
**<=** | Le <sup>(1)</sup>| Le | <= |
**>** | Gt <sup>(1)</sup>| Gt | > |
**>=** | Ge <sup>(1)</sup>| Ge | >= |
**IN** | In <sup>(1)</sup>| In | In <sup>(3)</sup> |
**NOT IN** | NotIn <sup>(1)</sup>| NotIn | NotIn <sup>(3)</sup> |
**NOT** | Not <sup>(1)</sup>| Not | ! |
**IS NULL** | IsNull <sup>(1)</sup><br>Eq(null) <sup>(1)</sup>| IsNull<br>Eq(null) | == null |
**IS NOT NULL** | IsNotNull <sup>(1)</sup><br>NotEq(null)<sup>(1)</sup> | IsNotNull<br>NotEq(null) | != null |
**AND** | And | | && *or* & |
**OR** | Or | | &#124;&#124; *or* &#124; |
**+** | Add | | + |
**-** | Subtract | | - |
**\*** | Multiply | | * |
**/** | Divide | | / |
**%** | Modulo | | % |
**&** | BitAnd | | & |
**&#124;** | BitOr | | &#124; |
**^** | BitXor | | ^ |
**ALL** | All | All | |
**ANY** | Any | Any | |
**EXISTS** | Exists | Exists | |
**SOME** | Some |  Some | |
**UNION** | Union | | |
**UNION ALL** | UnionAll | | |
**INTERSECT** | Intersect | | |
**EXCEPT** | Except | | |

> <sup>(1)</sup>: has also extension methods for `IQueryFragment`.
>
> <sup>(2)</sup>: extension method for `String`.
>
> <sup>(3)</sup>: extension method for `IEnumerable`.

### Like pattern
You can use the following methods to apply a like pattern:

ISqlBuilder | Result |
------------|------- |
ToLikeStart | Value% |
ToLikeEnd | %Value |
ToLikeAny | %Value% |

```csharp
IAlias person = sql.Alias("person");
IOperator op = person["Name"].Like(sql.ToLikeAny("SomeName"));

// Extension method
IOperator op = person["Name"].Like("SomeName".ToLikeAny());

```

---
[<Previous](builder.md) &nbsp;|&nbsp;  [Back to index](index.md) &nbsp;|&nbsp;  [Next>](functions.md)