import { Question } from '../types';

export const questions: Question[] = [
  {
    id: 1,
    question: "The product of two numbers is 2028 and their H.C.F. is 13. The number of such pairs is",
    options: ["A1","B2","C3","D4"],
    correctAnswer: 3,
    type: "multiple-choice",
    points: 1
  },
  {
    id: 2,
    question: " What will be the least number which when doubled will be exactly divisible by 12, 18, 21 and 30 ?",
    options: ["196", "630", "1260", "2520"],
    correctAnswer: 2,
    type: "multiple-choice",
    points: 1
  },
  {
    id: 3,
    question: "The sum of the digits of a two-digit number is 15 and the difference between the digits is 3. What is the two-digit number?",
    options: ["69", "78", "96", "Cannot be determined"],
    correctAnswer: 2,
    type: "multiple-choice",
    points: 1
  },
  {
    id: 4,
    question: "A number consists of two digits. If the digits interchange places and the new number is added to the original number, then the resulting number will be divisible by",
    options: ["3","5","6","11"],
    correctAnswer: 3,
    type: "multiple-choice",
    points: 1
  },
  {
    id: 5,
    question: "how many different ways can the letters of the word 'CORPORATION' be arranged so that the vowels always come together?",
    options: ["810","1440","2880","50400","5760","7200"],
    correctAnswer: 4,
    type: "multiple-choice",
    points: 1
  },
  {
    id: 6,
    question: " In a box, there are 8 red, 7 blue and 6 green balls. One ball is picked up randomly. What is the probability that it is neither red nor green?",
    options: ["13","3-1","8D","9","1/3"],
    correctAnswer: 4,
    type: "multiple-choice",
    points: 1
  },
  {
    id: 7,
    question: "8, 7, 11, 12, 14, 17, 17, 22, (....)",
    options: ["27","20","22","24"],
    correctAnswer: 3,
    type: "multiple-choice",
    points: 1
  },
  {
    id: 8,
    question: "Here are some words translated from an artificial language 1)hapllesh means cloudburst 2)srenchoch means pinball 3)resbosrench means ninepin 4)Which word could mean cloud nine",
    options: [],
    correctAnswer: "hapres",
    type: "fill-blank",
    points: 1
  },
  
{
  "id": 9,
  question: "Which of the following means The use of an object of one class in definition of another class?",
  options: ["Encapsulation", " Inheritance", "Compositio", "Abstractio"],
  correctAnswer: 2,
  type: "multiple-choice",
  points: 1
},

  {
  "id": 10,
  question: "What will be the output of the following Java program?\n\npublic class Main {\n    public static void main(String[] args) {\n        String a = \"newspaper\";\n        a = a.substring(5, 7);\n        char b = a.charAt(1);\n        a = a + b;\n        System.out.println(a);\n    }\n}",
  options: ["per", "pae", "ape", "er"],
  correctAnswer: 3,
  type: "multiple-choice",
  "points": 1
},
{
  "id": 11,
  question: "A sum of Rs. 4.75 lakhs was invested in Company Q in 1999 for one year. How much more interest would have been earned if the sum was invested in Company P?",
  options: ["Rs. 19,000", "Rs. 14,250", " Rs. 11,750", "Rs. 9500"],
  correctAnswer: 3,
  type: "multiple-choice",
  "points": 1
},
{
  "id": 12,
  question: "In 2000, a part of Rs. 30 lakhs was invested in Company P and the rest was invested in Company Q for one year. The total interest received was Rs. 2.43 lakhs. What was the amount invested in Company P?",
  options: [" Rs. 9 lakhs", " Rs. 11 lakhs", " Rs. 12 lakhs", " Rs. 18 lakhs"],
  correctAnswer: 3,
  type: "multiple-choice",
  "points": 1
},
{
  "id": 13,
  question: " If a - b = 3 and a 2 + b2 = 29, find the value of ab.",
  options: [],
  correctAnswer: "10",
  type: "fill-blank",
  "points": 1
},
{
  "id": 14,
  question: "The price of commodity X increases by 40 paise every year, while the price of commodity Y increases by 15 paise every year. If in 2001, the price of commodity X was Rs. 4.20 and that of Y was Rs. 6.30, in which year commodity X will cost 40 paise more than the commodity Y ?",
  options: ["2010", "2011", " 2012", "2013"],
  correctAnswer: 1,
  type: "multiple-choice",
  "points": 1
},
{
  "id": 15,
  question: " Sakshi can do a piece of work in 20 days. Tanya is 25% more efficient than Sakshi. The number of days taken by Tanya to do the same piece of work is:",
  options: ["15", "16", "18", "25"],
  correctAnswer: 1,
  type: "multiple-choice",
  "points": 1
},
{
  "id": 16,
  question: " If log 27 = 1.431, then the value of log 9 is:",
  options: [" 0.934", " 0.945", "  0.954", "0.958"],
  correctAnswer: 2,
  type: "multiple-choice",
  "points": 1
},
{
  "id": 17,
  question: "A man mixes two types of rice (X and Y) and sells the mixture at the rate of Rs. 17 per kg. Find his profit percentage. 1)The rate of X is Rs. 20 per kg. 2)The rate of Y is Rs. 13 per kg.",
  options: ["alone sufficient while II alone not sufficient to answer", "Il alone sufficient while I alone not sufficient to answer", "  Either I or Il alone sufficient to answer", " Both I and II are not sufficient to answer"," Both I and II are necessary to answer"],
  correctAnswer: 2,
  type: "multiple-choice",
  "points": 1
},
{
  "id": 18,
  question: "Ayesha's father was 38 years of age when she was born while her mother was 36 years old when her brother four years younger to her was born. What is the difference between the ages of her parents?",
  options: [" 2 years" , "4 years", "6 years", "8 years"],
  correctAnswer: 2,
  type: "multiple-choice",
  "points": 1
},
{
  "id": 19,
  question: " In a two-digit, if it is known that its unit's digit exceeds its ten's digit by 2 and that the product of the given number and the sum of its digits is equal to 144, then the number is:",
  options: [" 24" , "26", "42", "46"],
  correctAnswer: 0,
  type: "multiple-choice",
  "points": 1
},
{
  "id": 20,
  question: "In each of the following questions, arrange the given words in a meaningful sequence and thus find the correct answer from alternatives.,Arrange the words given below in a meaningful sequence.    Flower ,  Leaves, Tree, Branch,Fruit ",
  options: ["  4, 3, 1, 2, 5" , "4, 2, 5, 1, 3", "4, 3, 2, 1, 5", " 4, 2, 1, 3, 5"],
  correctAnswer: 2,
  type: "multiple-choice",
  "points": 1
},
{
  "id": 21,
  question: " Rohit walked 25 m towards south. Then he turned to his left and walked 20 m. He then turned to his left and walked 25 m. He again turned to his right and walked 15 m. At what distance is he from the starting point and in which direction? ",
  options: [" 35 m East" , "35 m North", " 30 m West ", "45 m East"],
  correctAnswer: 0,
  type: "multiple-choice",
  "points": 1
},
{
  "id": 22,
  question: "A man fixed an appointment to meet the manager, Manager asked him to come two days after the day before the day after tomorrow. Today is Friday. When will the manager expect him?",
  options: [" Friday" , "Monday", "Tuesday", "Sunday"],
  correctAnswer: 2,
  type: "multiple-choice",
  "points": 2
},
{
  "id": 23,
  question: "Find the value of X,Y and Z in the following 1)X X X X  2)Y Y Y Y  3)Z Z Z Z  4)Y X X X Z",
  options: ["X=9 , Y=2; Z=8" , "X=9 , Y=1; Z=9", "X=8 , Y=1; Z=8", "X=9 , Y=1; Z=8"],
  correctAnswer: 3,
  type: "multiple-choice",
  "points": 1
},
{
  id: 24,
  question: " I have a few sweets to be distributed. If I keep 2, 3 or 4 in a pack, I am left with one sweet. If I keep 5 in a pack, I am left with none. What is the minimum number of sweets I have to pack and distribute?",
  options: ["25" , "37", "54", "65"],
  correctAnswer: 1,
  type: "multiple-choice",
  points: 1
},
{
  
  id: 25,
  question: "React: Handling Button Click (State Update)\n\nWhat should replace the blank line to correctly increment the count when the button is clicked?\n\n```jsx\nfunction Counter() {\n  const [count, setCount] = React.useState(0);\n\n  function increment() {\n    ___________________;\n  }\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={increment}>Add</button>\n    </div>\n  );\n}\n```",
  options: [],
  correctAnswer: "setCount(count + 1)",
  type: "fill-blank",
  points: 1
},
{
  id: 26,
  question: "HTML: Line Break html Copy Edit <p>This is the first line. <> This is the second line.</p>",
  options: [],
  correctAnswer: "<br>",
  type: "fill-blank",
  points: 1
},
{
  "id": 27,
  question: "JavaScript: Declare a Variable with let javascript Copy Edit__________ age = 25;",
  options: [],
  correctAnswer: "let",
  type: "fill-blank",
  "points": 1
},
{
  id: 28,
  question: "JavaScript DOM: Change Text on Button Click\n\nWhat should fill in the blank to change the text content of the paragraph?\n\n```html\n<p id=\"text\">Original Text</p>\n<button onclick=\"changeText()\">Change</button>\n\n<script>\n  function changeText() {\n    document.getElementById(\"text\").______________ = \"Updated Text\";\n  }\n</script>\n```",
  options: [
    "innerText",
    "textContent",
    "innerHTML",
    "value"
  ],
  correctAnswer:"innerText or innerHTML",
  type: "fill-blank",
  points: 1
},
{
  "id": 29,
  question: "Which of the following HTTP status codes means Method Not Allowed?",
  options: [" 400" , "403", "405", " 501"],
  correctAnswer: 2,
  type: "multiple-choice",
  "points": 1
},
{
  "id": 30,
  question: "Which of the following statements about the async and defer attributes in a <script> tag is true?",
  options: [" Both load the script after the HTML is parsed" , "async blocks HTML parsing, while defer doesn’t", "defer ensures scripts execute in order, async does not", " async delays script download, defer does not"],
  correctAnswer: 1,
  type: "multiple-choice",
  "points": 1
},
];