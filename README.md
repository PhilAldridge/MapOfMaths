# Map of Maths
This project aims to use neo4j, a Network Graph database, to create an interactive map of maths. See deployed version [here](https://map-of-maths.vercel.app/)
<img width="934" alt="mapofmaths" src="https://github.com/PhilAldridge/MapOfMaths/assets/105776682/dcd405f0-b313-4e21-9181-285de1580a3a">

## Features
- Visualised graph of maths concepts and how they relate to each other
- Ability to add maths concepts and connections to the graph
- Search function to find maths concepts by name
- Page for each maths concept with a tree list of dependent concepts, questions linked to the concept and the ability to create new questions.
- Page for each question type. Generates randomised questions and checks your answers.
- OAuth login with admin/non-admin roles

## Stack used:
- NextJs with Typescript and Tailwind CSS
- Neo4j database hosted on Aura
- Continuous deployment on Vercel
- Graph visualisation using NeoVis
- NextAuth
