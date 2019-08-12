# Case when
```csharp
IAlias person = sql.Alias("person");

ICase caseWhen = sql.Case
    .When(person["Name"].IsNotNull(), person["Name"])
    .Else(person["SurName"]);
```

With lambda expressions:
```csharp
Person person = null;

ICase caseWhen = sql.Case
    .When(() => person.Name != null, () => person.Name)
    .Else(() => person.SurName);
```