# Prevent SQL injection
This page shows how you can prevent SQL injection attacks. In the following examples, the variable **userInput** is a `string` with a value provided by the user.

## Input values
All values are added as parameters so they are safe:
```csharp
// Safe
IQuery query1 = sql.Query.Select(userInput);

// Safe
IAlias person2 = sql.Alias("person");
IQuery query2 = sql.Query.Where(person2["Name"].Eq(userInput));

// Safe
Person person3 = null;
IQuery query3 = sql.Query.Where(() => person3.Name == userInput);
```

## Table, alias and column names
By default all names are escaped, and the escape character is removed from the name. Although this can prevent some attacks, they are still vulnerable:
```csharp
// Unsafe
IQuery query1 = sql.Query
    .From(userInput)
    .Join(userInput);

// Unsafe
IQuery query2 = sql.Query
    .From("person", userInput)
    .Join("dept", userInput);

// Unsafe
IAlias alias3 = sql.Alias(userInput);
IAlias person3 = sql.Alias("person", userInput);
IAlias<Department> dept3 = sql.Alias<Department>(userInput);

// Unsafe
IAlias person4 = sql.Alias("person");
IQuery query4 = sql.Query
    .Select(person4[userInput]);
```

Column names of the **typed alias** are safe because it only allows the registered columns:
```csharp
// Safe
IAlias<Person> person = sql.Alias<Person>();

IQuery query = sql.Query
    .Select(person[userInput]);
```

!!! warning
    Always validate user input, do not allow the user to select any column.

## Function names
Function names are vulnerable:
```csharp
// Unsafe
IAlias person = sql.Alias("person");
IFunction func = sql.Function(userInput).Add(person["Name"]);
```

But they can be safe if you enable **FunctionsOnlyRegistered** in the engine options:
```csharp
// Safe
engine.Options.FunctionsOnlyRegistered = true;

IAlias person = sql.Alias("person");
IFunction func = sql.Function(userInput).Add(person["Name"]);
```

!!! warning
    Always validate user input, do not allow the user to execute any function.

## Raw SQL
The SQL string is vulnerable, do not pass a concatenated or interpolated string:
```csharp
// Unsafe
IRawSql raw1 = sql.Raw("WHERE person.Name = '" + userInput + "'");

// Unsafe
IRawSql raw2 = sql.Raw($"WHERE person.Name = '{userInput}'");

// Unsafe
IRawSql raw3 = sql.Raw(string.Format("WHERE person.Name = '{0}'", userInput));
```

Instead, use a composite format string to add the values as parameters:
```csharp
// Safe
IRawSql raw = sql.Raw("WHERE person.Name = {0}", userInput);
```