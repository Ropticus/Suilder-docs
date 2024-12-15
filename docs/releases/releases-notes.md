# Release notes

## 2.5.0
Improve column name configuration:

- Add default column name configuration.
- Add partial names for nested types.

Improve expressions:

- Add support for checked operators.
- Add support for array length expressions.
- Improve alias and column expressions.
- Improve compiled expressions.
- Add **Col** method to create a column with an alias.

## 2.4.1
- Fix **Concat** operator function parentheses.

## 2.4.0
Add simple case statement.

Operators:

- Add between, not between, negate, bit not, left shift, right shift, except all and intersect all operators.
- Add extension methods for more operators.
- Improve parentheses.
- Add `ISetOperator` interface for set operators.
- Set operators now wrap queries in parentheses by default.
- Add translations of operators.

Columns:

- Add **Name** property to create a column without the table name or alias.

Expressions:

- Improve lambda expressions.
- Improve compiled expressions.
- Add support for conditional expressions.
- Improve the **Val** method to support all operators.
- Improve the **Add** operator to use the **Concat** method when the type of the expression is a string.
- Add **As** method to change the type of a value.
- Add **ColName** method to create a column without the table name or alias.
- Improve functions with params argument in expressions.

Parameters:

- Add null values as parameters.

## 2.3.0
Add support for positional parameters:

- Add **ParameterIndex** property to the engine options.
- Add **ParametersList** property to the query result for positional parameters.
- Change the default parameter prefix of the Oracle engine to `":p"`.

Add schema name configuration.

Add support for IEnumerable properties:

- `IEnumerable` properties are no longer ignored.
- `IEnumerable<T>` properties where **T** is another table are ignored.

Improve lambda expressions:

- Add support for the coalesce operator.
- Add support for list init expressions.
- Fix compiled convert expressions.
- Improve compiled binary expressions.

## 2.2.1
- Add support for array index expressions.
- Fix expressions of the **Col** method with multiple nested properties.

## 2.2.0
Improve the performance of lambda expressions:

- Improve expressions of alias and columns.
- Improve expressions of values and methods.
- Improve raw format.
- Expressions no longer create generic aliases and columns.

Fixes:

- Fix nested properties in expressions.
- Fix the **In** operator converts a single string into multiple parameters.

## 2.1.0
Add support for array values:

- `IEnumerable` values are no longer divided into multiple parameters.
- To add multiple parameters you have to use the `ISubList` interface.
- The **In** operator automatically adds the values to an `ISubList`.
- `Array` properties are not ignored by default.

## 2.0.0
Rewrite of the table builder:

- The table builder has been moved to the `Suilder.Reflection.Builder` namespace.
- Added support for nested types.
- Added support for custom metadata.
- Custom configuration processors can be added to the table builder.
- The **Add** method without arguments now returns an entity builder.
- Methods that change the default configuration have the **Default** prefix.
- The default inheritance configuration can be changed.
- Method **WithName** renamed to **TableName**.
- New **Property** method that allows to chain the property configuration.
- All methods provide overloads with a string argument for the property name instead of an expression.

Engine changes:

- The suffix **Engine** has been added to the engine names.
- Now you have to use the **GetInfo** method to get the configuration of a type. The rest of the methods have been removed.

## 1.2.1
- Fix lambda expressions that combine arithmetic and bit operators.

## 1.2.0
- Add raw **top** option in select, update and delete.
- Fix **Upper** function in `SqlExp`.

## 1.1.1
- Fix default **Cast** function in all engines.
- Fix **Ltrim** and **Rtrim** functions in MySQL when there is only one argument.

## 1.1.0
- Add support for insert multiple rows using select union all.
- Add dummy table for Oracle DB.
- Fix missing **Now** function in `SqlFn` and `SqlExp`.

## 1.0.0
- First version.