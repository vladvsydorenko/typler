const parsers = [
    {
        name: 'typename',
        length: -1,
        test: (char: string, lastChar: string): boolean => {
            return /[^<>|]/i.test(char);
        }
    },
    {
        name: 'of',
        length: 1,
        test: (char: string, lastChar: string) => {
            if (char === '<') {
                if (lastChar === '<') throw new Error('Duplicate "<"');
                if (lastChar === '>') throw new Error('No reason for "<" after ">"');
                return true;
            }
        }
    },
    {
        name: 'ofEnd',
        length: 1,
        test: (char: string) => char === '>',
    },
    {
        name: 'or',
        length: 1,
        test: (char: string, lastChar: string) => {
            if (char === '|') {
                if (lastChar === '|') throw new Error('Duplicate "|"');
            }
            return true;
        }
    }
];

function tokenize(source: string) {
    const trimedSource = source.replace(/\s/gi, '');
    const tokens: any[] = [];

    let lastToken;
    let lastChar: string;
    let char: string;

    for (let i = 0, length = trimedSource.length; i < length; i++) {
        char = trimedSource[i];

        // console.log(char, lastChar);
        parsers.some((parser) => {
            if (parser.test(char, lastChar)) {
                if (tokens.length !== 0 &&
                    tokens[tokens.length - 1].name === parser.name &&
                    (parser.length === -1 || tokens[tokens.length - 1].value.length < parser.length)
                ) {
                    tokens[tokens.length - 1].value += char;
                }
                else  {
                    tokens.push({
                        name: parser.name,
                        value: char,
                    });
                }
                return true;
            }
            return false;
        });

        lastChar = char;
    }

    return tokens;
}

function buildType(tokens: {name: string, value: string}[]) {
    const tree: any[] = [{}];
    let level = tree;
    let levels: any[] = [];
    let scope = tree[0];

    tokens.forEach(({name, value}) => {
        switch (name) {
            case 'typename': {
                if (scope.type) {
                    scope = {};
                    level.push(scope);
                }
                scope.type = value;
                break;
            }
            case 'of': {
                scope.of = scope.of || [{}];
                levels.push(level);
                level = scope.of;
                scope = scope.of[scope.of.length - 1];
                break;
            }
            case 'ofEnd': {
                level = levels.pop();
                break;
            }
            case 'or': {
                break;
            }
        }
    });

    return tree;
}

export function parseType(type: string) {
    return buildType(tokenize(type));
}
