---
title: TypeScript中有哪些声明变量的方式？
index: 1
date: '2023-09-06'
rate: 1
---

1.  使用 `let` 关键字：
    
    ```typescript
    let x: number = 10;
    ```
    
2.  使用 `const` 关键字来声明常量：
    
    ```typescript
    const pi: number = 3.14;
    ```
    
3.  使用 `var` 关键字（不推荐，通常在ES6之前使用）：
    
    ```typescript
    var name: string = "John";
    ```
    
4.  使用函数作用域声明变量：
    
    ```typescript
    function example() {
        var localVar: number = 42;
    }
    ```
    
5.  使用函数参数的方式声明变量：
    
    ```typescript
    function greet(name: string) {
        console.log(`Hello, ${name}!`);
    }
    ```
    
6.  使用对象字面量声明变量：
    
    ```typescript
    let person: { name: string, age: number } = { name: "Alice", age: 30 };
    ```
    
7.  使用数组字面量声明数组变量：
    
    ```typescript
    let numbers: number[] = [1, 2, 3, 4, 5];
    ```
    
8.  使用接口声明对象的结构：
    
    ```typescript
    interface Person {
        name: string;
        age: number;
    }
    
    let person: Person = { name: "Bob", age: 25 };
    ```
    
9.  使用类来声明对象：
    
    ```typescript
    class Animal {
        constructor(public name: string, public species: string) {}
    }
    
    let cat: Animal = new Animal("Fluffy", "Cat");
    ```