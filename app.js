const express = require('express');
const morgan = require('morgan');

const app = express();

// This is middleware that requests pass through
// on their way to the final handler
app.use(morgan('dev')); 

//This is the final request handler
app.get('/', (req, res) => {
    res.send('Hello Express!');
});

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
});

app.get('/burgers', (req, res) => {
    res.send('We have juicy cheeseburgers!');
});

app.get('/pizza/pepperoni', (req, res) => {
    res.send('Your pizza is on the way!');
});

app.get('/pizza/maggots', (req, res) => {
    res.send("We don't serve that here. Never call again!");
});

app.get('/echo', (req, res) => {
    const responseText = `Here are some details of your request:
        Base URL: ${req.baseUrl}
        Host: ${req.hostname}
        Path: ${req.path}
        Body: ${req.body}
        `;
        res.send(responseText)
});

app.get('/queryViewer', (req, res) => {
    console.log(req.query);
    res.end(); //do not send any data back to the client
});

app.get('/greetings', (req,res) => {
    //1. get values from the request
    const name = req.query.name;
    const race = req.query.race;

    //2. validate the values
    if(!name) {
        //3. name was not provides
        return res.status(400).send('Please provide a name');
    }
    if(!race) {
        //3. race was not provided
        return res.status(400).send('Please provide a race');
    }

    //4. and 5. both name and race are valid so do the processing
    const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;

    //6. send the response
    res.send(greeting);
});

app.get('/sum', (req, res) => {
    const a = parseInt(req.query.a);
    const b = parseInt(req.query.b);

    if(!a) {
        return res.status(400).send("Please provide a integer for 'a'");
    }
    if(!b) {
        return res.status(400).send("Please provide a integer for 'b'");
    }

    const sum = `The sum of a and b is ${a+b}`;

    res.send(sum);
})

app.get('/cipher', (req, res) => {
    const { text, shift } = req.query;

    //validation: both values are required, shift must be a number
    if(!text) {
        return res.status(400).send('text is required');
    }
    if(!shift) {
        return res.status(400).send('shift is required');
    }

    const numShift = parseFloat(shift);

    if(Number.isNaN(numShift)) {
        return res.status(400).send('shift must be a number');
    }

    //all valid, perform the task
    //Make text uppercase
    //Create loop over the characters, for each letter, convert using the shift

    const base = 'A'.charCodeAt(0); //get char code

    const cipher = text.toUpperCase()
        .split('') //create an array of characters
        .map(char => { //map each originall char to a converted char
            const code = char.charCodeAt(0); //get the char code
            
            //if its not one of the 26 letters ignore it
            if(code < base || code > (base + 26)) {
                return char;
            }
        
            //otherwise convert it, get the distance from A
            let diff = code - base;
            diff = diff + numShift;
        
            //in case shift takes the value past Z, cycle back to the begining
            diff = diff % 26;
        
            //conver back into a character
            const shiftedChar = String.fromCharCode(base + diff);
            return shiftedChar;
        })
        .join('');//construct a string from the array

    //return th response
    res.status(200).send(cipher);
});

app.get('/lotto', (req, res) => {
    const { numbers } = req.query;

    //validation:
    //1. the numbers array must exist
    //2. must be an array
    //3. must be 6 numbers
    //4. numbers must be between 1 and 20

    if(!numbers) {
        return res.status(400).send("numbers is required");
    }
    if(!Array.isArray(numbers)) {
        return res.status(400).send("numbers must be an array");
    }

    const guesses = numbers.map(n => parseInt(n))
        .filter(n => !Number.isNaN(n) && (n >= 1 && n <=20));

    if(guesses.length != 6) {
        return res.status(400).send("numbers must contain 6 integers between 1 and 20");
    }

    //fully validated numbers
    //here are the 20 numbers to chose from
    const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);

    //randomly chose 6
    const winningNumbers = [];
    for(let i =0; i < 6; i++) {
        const ran = Math.floor(Math.random() * stockNumbers.length);
        winningNumbers.push(stockNumbers[ran]);
        stockNumbers.splice(ran, 1);
    }

    //compare the guesses to the winning number
    let diff = winningNumbers.filter(n => !guesses.includes(n));

    //construct a response

    let responseText;

    switch(diff.length){
        case 0:
            responseText = 'Wow! Unbelievable! You could have won the mega millions!';
            break;
        case 1:
            responseText = 'Congratulations! You win $100!';
            break;
        case 2:
            responseText = 'Congratulations, you win a free ticket!';
            break;
        default:
            responseText = 'Sorry, you lose';
    }

    //uncomment below to see how the results ran
    // res.json({
    //     guesses,
    //     winningNumbers,
    //     diff,
    //     responseText
    // });

    res.send(responseText);
});

app.get('/hello', (req, res) => {
    res
        .status(204)
        .end();
});

app.get('/video', (req, res) => {
    const video = {
        title: 'Cats falling over',
        description: '15 minutes of hilarious fun as cats fall over',
        length: '15.40'
    }
    res.json(video);
});

app.get('/colors', (req, res) => {
    const colors = [
        {
            name: "red",
            rgb: "FF0000"
        },
        {
            name: "green",
            rgb: "00FF00",
        },
        {
            name: "blue",
            rgb: "0000FF"
        },
    ];
    res.json(colors);
});

app.get('/grade', (req, res) => {
    //get the mark from the query 
    const { mark } = req.query;

    //do some validation
    if(!mark) {
        //mark is required
        return res
            .status(400)
            .send('Please provide a mark');
    }

    const numericMark = parseFloat(mark);
    if (Number.isNaN(numericMark)) {
        //mark must be a number
        return res
            .status(400)
            .send('Mark must be a numeric value');
    }

    if (numericMark < 0 || numericMark > 100) {
        return res
            .status(400)
            .send('Mark must be in the range 0 to 100');
    }

    if (numericMark >= 90) {
        return res.send('A');
    }

    if (numericMark >= 80) {
        return res.send('B');
    }

    if (numericMark >= 70) {
        return res.send('C');
    }

    res.send('F');
});
