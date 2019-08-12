# From, join and CTE
The **from** and **join** clauses support **subqueries** and **common table expressions** (CTE).

## From
```csharp
IAlias person = sql.Alias("person");

// From table
IFrom from1 = sql.From(person);

// From subquery
IAlias personSub = sql.Alias("personSub"); // Alias of subquery
IFrom from2 = sql.From(sql.Query.Select(personSub.All).From(personSub), person);

// From CTE
IAlias personCte = sql.Alias("personCte"); // Alias of CTE
ICte cte1 = sql.Cte("cte1").As(sql.Query.Select(personCte.All).From(personCte));
IFrom from3 = sql.From(cte1, person);

// Raw options
IFrom from4 = sql.From(person).Options(sql.Raw("WITH (NO LOCK)"));
```

With lambda expressions:
```csharp
Person person = null;

// From table
IFrom from1 = sql.From(() => person);

// From subquery
Person personSub = null; // Alias of subquery
IFrom from2 = sql.From(sql.Query.Select(() => personSub).From(() => personSub), () => person);

// From CTE
Person personCte = null; // Alias of CTE
ICte cte1 = sql.Cte("cte1").As(sql.Query.Select(() => personCte).From(() => personCte));
IFrom from3 = sql.From(cte1, () => person);

// Raw options
IFrom from4 = sql.From(() => person).Options(sql.Raw("WITH (NO LOCK)"));
```

With query object:
```csharp
IAlias person = sql.Alias("person");

// Add from to the query
IFrom from = sql.From(person);
IQuery query1 = sql.Query.From(from);

// Create from
IQuery query2 = sql.Query
    .From(person);
```

For engines that require to use a **dummy table** you can use the following. It can be used in all engines, to write the same query for all. If the engine does not need a dummy table, writes nothing:
```csharp
// From dummy table
IQuery query3 = sql.Query.Select(SqlFn.Now())
    .From(sql.FromDummy);
```

## Join
```csharp
IAlias dept = sql.Alias("dept");

// Join table
IJoin join1 = sql.Join(dept);

// Join type
IJoin join2 = sql.Left.Join(dept);
IJoin join3 = sql.Join(dept, JoinType.Left);

// On clause
IJoin join4 = sql.Join(dept).On(dept["Id"].Eq(person["DepartmentId"]));

// Join subquery
IAlias deptSub = sql.Alias("deptSub"); // Alias of subquery
IJoin join5 = sql.Join(sql.Query.Select(dept.All).From(dept), deptSub);

// Join CTE
IAlias deptCte = sql.Alias("deptCte"); // Alias of CTE
ICte cte2 = sql.Cte("cte2").As(sql.Query.Select(dept.All).From(dept));
IJoin join6 = sql.Join(cte2, deptCte);

// Raw options
IJoin join7 = sql.Join(dept).Options(sql.Raw("WITH (NO LOCK)"));
```

With lambda expressions:
```csharp
Department dept = null;

// Join table
IJoin join = sql.Join(() => dept);

// Join type
IJoin join2 = sql.Left.Join(() => dept);
IJoin join3 = sql.Join(() => dept, JoinType.Left);

// On clause
IJoin join4 = sql.Join(() => dept).On(() => dept.Id == person.Department.Id);

// Join subquery
Department deptSub = null; // Alias of subquery
IJoin join5 = sql.Join(sql.Query.Select(() => dept).From(() => dept), () => deptSub);

// Join CTE
Department deptCte = null; // Alias of CTE
ICte cte2 = sql.Cte("cte2").As(sql.Query.Select(() => dept).From(() => dept));
IJoin join6 = sql.Join(cte2, () => deptCte);

// Raw options
IJoin join7 = sql.Join(() => dept).Options(sql.Raw("WITH (NO LOCK)"));
```

With query object:
```csharp
IAlias person = sql.Alias("person");

// Add join to the query
IJoin join = sql.Join(dept).On(dept["Id"].Eq(person["DepartmentId"]));
IQuery query1 = sql.Query.Join(join);

// Create join
IQuery query2 = sql.Query
    .Join(dept)
        .On(dept["Id"].Eq(person["DepartmentId"]));
```

## CTE
Adding a CTE to a **from** or **join** clause, does not add them to the query, you have to use the with clause:
```csharp

Person personCte = null;
Department deptCte = null;

ICte cte1 = sql.Cte("cte1").As(sql.Query.Select(() => personCte).From(() => personCte));
ICte cte2 = sql.Cte("cte2").As(sql.Query.Select(() => deptCte).From(() => deptCte));

Person person = null;
Department dept = null;

IQuery query = sql.Query
    .With(cte, ct2)
    .Select(() => person, () => dept)
    .From(cte1, () => person)
    .Join(cte2, () => dept)
        .On(() => dept.Id == person.Department.Id);
```