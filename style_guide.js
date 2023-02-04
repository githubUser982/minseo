//--------------------------------------------------------------------------------------------
// Bomi's style guide:
//--------------------------------------------------------------------------------------------

// This is my preferences, not the word of god. You can do whatever you want, but I will be sad if you stray too far from this guide.

//  BASICS:
// Use tabs for indentation
// You can set tab size to whatever you want
// Use comments to explain what you are doing if its weird or complicated
// Use camelCase for variables and functions (ex: myVariable, myFunction) as much as possible

// Basic means generic, few features, already created many times. It does not mean simple.
// Advanced means versatile, powerful, fast and with a lot of features. Features others said were impossible.
// Simple means less lines of code, in total, modules and libraries included. It means clear, linear, easy to read and understand without knowing the intricacies of the language or the libraries. Easy to modify and extend.
// Complex means more lines of code, in total. It means hard to read, lots of jumping around, requiring you learn the intricacies of the language and the libraries. Hard to modify and extend.

// PROGRAMMING STUFF:
// 1. Use commonJS
// 2. Use let or const it doesn't matter
// 3. Don't use built-in functions too much, use for loops instead to make it more readable and simple.
// 4. There are many reasons, can be faster, it is MUCH more flexible and easy to extend.
// 5. Dont use arrow functions, they do not get hoisted and are harder to read.
// 6. Don't use setTimeout or setInterval, they are messy and hard to read.
// 7. Use async/await instead of promises, they are much easier to read and understand.
// 8. Also use async/await instead of callbacks, they are much easier to read and understand.
// 9. Aaaand use async/await instead of .then() chains, they are much easier to read and understand.
// 10. async/await is the best thing ever, use it everywhere.
// 11. A genious admires simplicity. A genius is not impressed by complexity, he is impressed by the advanced functionality of simplicity.
// 12. New programmers often over-complicate things and create unspeakable horrors because they don't understand the basics.
// 13. A lot of very experienced programmers over-complicate things and create unspeakable horrors because they have gotten into complex patterns and styles rather than focusing on making advanced functionality.

// OBJECT ORIENTED PROGRAMMING:
// 1. Don't use inheritance, it is not needed. 
// 2. Don't add pointless methods to classes, just use functions. 
// 3. Don't use pointless getters and setters, they are not useful and will make your code 3x longer.
// 4. Use objects a lot if you want, to hold functions to make neater require statements.
// 5. Don't overuse functions of any kind. Do not use them when the code is one long synchronous line. It's a big pain to jump around the code pointlessly.
// A local function that is less than 4 lines is pointless. You have just made the code longer for no reason.
// 6. Make new functions when you can reuse code in multiple places, this will reduce the amount of code you have to write and read.



// LIBRARIES:
// 1. Don't use pointless libraries such as isOdd. Just use the % operator, which is shorter. There are many such libraries that are pointless but people use them.
// 2. Don't use libraries that do the same thing as built-in functions. For example, don't use a library to get the length of an array when you can just use .length.
// 3. Don't overestimate modules/libraries. Lets say you want to make a simple game like tic-tac-toe. Making it is not hard at all. It's actually harder  to figure out what the module developers were thinking when they made the modules arbitrarily choices.
// 4. Don't use overcomplicated modules, OOP ones especially. They are a pain to use and understand, your code will be longer from trying to wrangle it. They are also a pain to extend and modify and almost never have that feature you need, then you have to start over with something else.
// 5. Use modules that greatly simplify your job. For example, discord.js, making a bot without it will be painful. A ORM library will make your life much easier too.
// 6. Remember... Every time a module is updated, you are taking a chance that the dev or someone that compromized them didn't decide to install a virus on your computer or nuke your disk. Likewise you better hope they didn't break your code. Be careful with modules.





// -----------------------------------------------
// EXAMPLES:
// -----------------------------------------------


// Don't do this:
let message

message.channel.send('Hello').then(() => {
    message.channel.send('World').then(() => {
        message.channel.send('!')
    })
})

// Do this:

await message.channel.send('Hello')
await message.channel.send('World')
await message.channel.send('!')


// Don't do this:
// Example of using .map and .filter

let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

{
    let newArr = arr.map((num) => {
        return num * 2
    }).filter((num) => {
        return num % 2 === 0
    })
}

// Do this:

{
    let newArr = []

    for (let i = 0; i < arr.length; i++) {
        let num = arr[i]
        if (num % 2 === 0) {
            newArr.push(num * 2)
        }
    }
}

// Don't do this:
// OOP

{
    class User {
        constructor(name, skill) {
            this.name = name
            this.skill = skill
        }

        getSkill() {
            return this.skill
        }

        setSkill(skill) {
            this.skill = skill
        }

        resetSkill() {
            this.skill = 0
        }

        addSkill(skill) {
            this.skill += skill
        }

        reName(name) {
            this.name = name
        }
    }

    let user = new User('juju', 50)
    user.addSkill(10)
}

// Do this: 
// See how much shorter it is? It's also much easier to read and understand.

{
    let user = {
        name: "juju",
        skill: 50,
    }

    user.skill += 10
}

// Don't do this:
// Using pointless libraries

let isEven = require('is-even')

if (isEven(4)) {
    console.log('Even')
}

// Do this:

if (4 % 2 === 0) console.log('Even')



