# Suilder - SQL query builder
[Suilder](https://github.com/Ropticus/Suilder) is a SQL query builder for .NET.

Suilder is focused on the use of [**alias objects**](builder.md#alias-and-columns) to reference tables and column names, there are different types of alias, that can use strings or lambda expressions, and support translation of names. The queries are built by combining smaller query fragments, allowing us to build dynamic queries easily.

This library is only a query builder, so you have to combine with any other library to execute the queries and mapping the result.

## Installing

Package | Nuget | Download (full) |
--------|-------|----------|
Suilder | [![Nuget](https://img.shields.io/nuget/v/Suilder?logo=nuget)](https://www.nuget.org/packages/Suilder/) | [![GitHub release](https://img.shields.io/github/release/Ropticus/Suilder?logo=github)](https://github.com/Ropticus/Suilder/releases/latest) |
Suilder.Engines | [![Nuget](https://img.shields.io/nuget/v/Suilder.Engines?logo=nuget)](https://www.nuget.org/packages/Suilder.Engines/) | |

## Release notes
Read [release notes](releases.md).

## Configuration
* [Entity classes](entity-classes.md)
    * [Inheritance patterns](entity-classes.md#inheritance-patterns)
    * [Configuration](entity-classes.md#configuration)
* [Engines](engines.md)
    * [Supported engines](engines.md#supported-engines)
    * [Engine configuration](engines.md#engine-configuration)
    * [Register functions](engines.md#register-functions)

## General
* [The builder](builder.md)
    * [Alias and columns](builder.md#alias-and-columns)
    * [Lambda expressions](builder.md#lambda-expressions)
    * [Compile the query](builder.md#compile-the-query)
    * [Utilities classes](builder.md#utilities-classes)
    * [Custom components](builder.md#custom-components)
* [Operators](operators.md)
* [Functions](functions.md)
* [Query](query.md)
* [Select](select.md)
* [From, join and CTE](from-join-cte.md)
* [Where and having](where-having.md)
* [Group by](group-by.md)
* [OrderBy](order-by.md)
* [Offset and limit](offset.md)
* [Insert](insert.md)
* [Update](update.md)
* [Delete](delete.md)
* [Raw SQL](raw-sql.md)
* [CRUD operations](crud.md)