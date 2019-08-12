# Entity classes
You can use your entity classes to build the queries, this allows you to translate the tables and column names, and build strongly typed queries. Your classes equals an alias of a table, and works in the same manner that a SQL alias.

This means that there are some restrictions when you use a property of a class in a query:

* The property must exist as a column in the table, you cannot navigate to columns of other tables, you must do a join and use the property of the joined table.
* You can use navigation properties for foreign keys, because the foreign key is a column of your table.
* You cannot use inverse properties, because the column belongs to another table.
* You cannot use lists, because these are inverse properties.

!!! note
    These restrictions are only for building the queries, you can use any property for mapping the results.

## Table builder
You have to use the `TableBuilder` class to configure your classes. You can add classes that are not a table, like an **abstract** class, to share the same configuration with all derived classes. After you finish to register all your classes pass your `TableBuilder` to an engine:
```csharp
// Create a table builder and add your entity classes
TableBuilder tableBuilder = new TableBuilder()
    .Add<Person>()
    .Add<Department>();

// Create an engine with the table builder
IEngine engine = new Engine(tableBuilder);
```
!!! tip
    If you have multiple engines and need different configurations for each one, you can create multiple `TableBuilder`.

## Inheritance patterns
The inheritance patterns work different in Suilder, because it never generates automatically any SQL clause depending on your class structure. Each class is mapped to only one table and it works like an alias of the table.

There are 3 properties to configure the inheritance:

* **IsTable**: if true, the class is added as a table, else, is only used to inherit the configuration for derived classes. By default is false for **abstract** classes.
* **InheritColumns**: if the class must inherit the columns of the base class. By default is true for classes whose base type is **abstract**.
* **InheritTable**: if the class must inherit the table name and the columns of the base class. By default is false.

With these properties you can emulate the most common patterns like, Table per concrete type (TPC), Table per type (TPT) and Table per hierarchy (TPH).

For the following examples, we use this inheritance structure:
```
      BaseConfig
      /        \
   Person   Department
    /
Employee
```

### Table per concrete type (TPC)
To use the TPC pattern, you have to set the following configuration:

* Set **IsTable** to false for `BaseConfig` class.
* Set **InheritColumns** to true for `Person` and `Department` class.

This is **done by default** if the class `BaseConfig` is **abtract**.

### Table per type (TPT)
To use the TPT pattern, you have to set the following configuration:

* Set **InheritColumns** to false for `Employee` class.

This is the **default configuration** for classes that inherit a **non abstract** class.

!!! warning
    If you use the `Employee` class, you only get the columns of the `Employee` table. You have to add a join with the `Person` class, like you would do in SQL.

### Table per hierarchy
To use the TPH pattern, you have to set the following configuration:

* Set **InheritTable** to true for `Employee` class.

!!! warning
    If you use the `Employee` class, you get both, the rows of `Employee` and `Person`. You have to add a where clause with your column discriminator, like you would do in SQL, to only get the `Employee` type.

## Configuration
You can use **attributes** or the **Add** method of the `TableBuilder` to set the configuration of the class.

The **attributes** have the limitation that you cannot have multiple configurations for different engines.
The **Add** method has more precedence and overrides the configuration of the attributes.

### Conventions
The following conventions are used by default:

* The primary key is the **Id** property if exists in the class.
* If a property is another table, is used as foreign key. By default it uses the primary keys of the other table, concatenating the name of the property and primary key property. For example: `Department.Id` -> "DepartmentId".
* Only public properties with a getter and setter are added as columns.
* **IEnumerable** properties are ignored (except string type obviously).

!!! warning
    Remember that you can not use inverse properties, so if you have a reverse one to one property, you have to mark that property as [ignored](#ignore-property).

### Default config
You can change the default primary key and default table name:
```csharp
tableBuilder
    .PrimaryKey(x => "Guid")
    .TableName(x => "prefix_"+ x.Name);
```

### Table config
These parameters control the inheritance patterns.

With attribute:
```csharp
[Table(IsTable = false)]
public class BaseConfig {...}

[Table(InheritColumns = true)]
public class Person : BaseConfig {...}

[Table(InheritTable = true)]
public class Employee : Person {...}
```

With table builder:
```csharp
tableBuilder.Add<BaseConfig>(config => config
    .IsTable(false));
tableBuilder.Add<Person>(config => config
    .InheritColumns(true));
tableBuilder.Add<Employee>(config => config
    .InheritTable(true));
```

### Table name
With attribute:
```csharp
[Table("Dept")]
public class Department
```

With table builder:
```csharp
tableBuilder.Add<Department>(config => config
    .WithName("Dept"));
```

### Primary key
With attribute:
```csharp
[PrimaryKey]
public int Id {get; set;}
```

With table builder:
```csharp
tableBuilder.Add<Person>(config => config
    .PrimaryKey(x => x.Id));
```

#### Composite key
With attribute:
```csharp
[PrimaryKey(1)]
public int Id1 {get; set;}

[PrimaryKey(2)]
public string Id2 {get; set;}
```

With table builder:
```csharp
tableBuilder.Add<Person>(config => config
    .PrimaryKey(x => x.Id1)
    .PrimaryKey(x => x.Id2));
```

### Column name
With attribute:
```csharp
[Column("LastName")]
public string SurName {get; set;}
```

With table builder:
```csharp
tableBuilder.Add<Person>(config => config
    .ColumnName(x => x.SurName, "LastName"));
```

### Foreign key
```csharp
[ForeignKey("DeptId")]
public Department Department {get; set;}
```

With table builder:
```csharp
tableBuilder.Add<Person>(config => config
    .ForeignKey(x => x.Department.Id, "DeptId"));
```

!!! note
    If your foreign key is not a navigation property, you can use indistinctly the **Column** or **ForeignKey** attribute, and **ColumnName** or **ForeignKey** method.

#### Composite key
With attribute:
```csharp
[ForeignKey("Id1")]
[ForeignKey("Id2", "DeptId")]
public Department Department {get; set;}
```

With table builder:
```csharp
tableBuilder.Add<Person>(config => config
    .ForeignKey(x => x.Department.Id1)
    .ForeignKey(x => x.Department.Id2, "DeptId"));
```
### Ignore property
With attribute:
```csharp
[Ignore]
public string SurName {get; set;}
```

With table builder:
```csharp
tableBuilder.Add<Person>(config => config
    .Ignore(x => x.SurName);
```

## About select all
When you use a **select all** for an alias of an entity class, it selects only the registered columns. The order of the columns is **arbitrary**, but the primary keys are always added first. So you can, for example, use a **select all** in a **group by**, to group by the primary key and select the rest of the columns.