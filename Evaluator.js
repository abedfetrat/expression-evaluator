class Evaluator {
    constructor() {
    }

    // Parses provided input into tokens and returns the result as an array
    _tokenize(input) {
        let scanner = 0;
        const tokens = [];
        // While there are characters to be read in input:
        while (scanner < input.length) {
            // Read character
            const char = input[scanner];

            // If the character is a digit:
            if (/[0-9]/.test(char)) {
                let digits = "";

                // From this position forwards look for consecutive digits and decimals 
                // that makes a single number and parse them all as one
                while (/[0-9\.]/.test(input[scanner])) {
                    digits += input[scanner++];
                }
                // Push the number to the tokens array
                tokens.push(Number.parseFloat(digits));
                continue;
            }

            // If the character is a mathematical symbol (operator or parantheses) push it to the tokens array
            if (/[+\-/*()^]/.test(char)) {
                tokens.push(char);
                scanner++;
                continue;
            }

            // If the character is a white-space skip over it
            if (char === ' ') {
                scanner++;
                continue;
            }

            // If the character is none of the above it is an invalid character
            throw new Error(`The input contains an invalid character ${char} at position ${scanner}`);

        }

        return tokens;
    }

    // Evaluates the tokens array
    eval(expression) {
        const tokens = this._tokenize(expression);
        const numbers = [];
        const operators = [];

        // While there are tokens to be read:
        for (let i = 0; i < tokens.length; i++) {
            // Read token:
            const token = tokens[i];

            // If the token is a number push it to the numbers stack
            if (typeof token === 'number') {
                numbers.push(token);
                continue;
            }

            // If the token is a operator:
            if (/[+\-/*^]/.test(token)) {
                // While the top most operator in the operators stack has equal or greater presedence
                // pop it and perform the operation
                while (this._shouldUnwindOperatorStack(operators, token)) {
                    this._performOperation(numbers, operators.pop());
                }
                // Push the operator to the operators stack
                operators.push(token);
                continue;
            }

            // If the token is a opening parenthese push it to the operators stack
            if (token === '(') {
                operators.push(token);
                continue;
            }

            // If token is a closing parenthese: 
            if (token === ')') {
                // While the opening parenthes has not yet been encountered
                // pop an operator from the operators stack and perform the operation
                while (operators.length > 0 && operators[operators.length - 1] !== '(') {
                    this._performOperation(numbers, operators.pop());
                }
                // Discard the opening parenthese
                operators.pop();
                continue;
            }

            // Token didn't match any of the above cases. It means token is invalid
            throw new Error(`The token ${token} at position ${i} is of invalid character.`);
        }

        // If there are any operators left in the operators stack, pop them and perform the operation
        for (let i = operators.length - 1; i >= 0; i--) {
            this._performOperation(numbers, operators.pop());
        }

        // The last number left in the numbers stack is the result of the evaluation
        return numbers.pop();
    }

    // Helper function to get presedence of operator
    _presedence(operator) {
        switch (operator) {
            case '^':
                return 3;
            case '*':
            case '/':
                return 2;
            case '+':
            case '-':
                return 1;
        }
    }
    // Helper function to determine if should unwind operator stack
    _shouldUnwindOperatorStack(operators, nextOperator) {
        if (operators.length === 0) {
            return false;
        }
        // Opening parenthese encounterd. Should stop unwind
        if (nextOperator === '(') {
            return false;
        }

        const previousOperator = operators[operators.length - 1];
        return this._presedence(previousOperator) >= this._presedence(nextOperator);
    }
    // Helper function for performing operations and pushing the result to the numbers stack
    _performOperation(numbers, operation) {
        const a = numbers.pop();
        const b = numbers.pop();
        let c = undefined;
        switch (operation) {
            case '*':
                c = b * a;
                break;
            case '/':
                c = b / a;
                break;
            case '+':
                c = b + a;
                break;
            case '-':
                c = b - a;
                break;
            case '^':
                c = Math.pow(b, a);
                break;
        }
        numbers.push(c);
    }
}