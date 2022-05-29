const request = require('supertest')
const connection = require('../database/db')
const { app, server } = require('../app')

const userR = {
    usertype: 'paciente',
    usermail: 'a@a',
    pass: '12345678',
}
const userW = {
    usertype: 'paciente',
    usermail: 'a@a',
    pass: '123456789',
}

describe('Pruebas de Covertura de sentencia', () => {
    test('Ingresando a ruta de Registro', async () => {
        const response = await request(app)
            .get('/register')
        console.log(response.statusCode)
    })
    test('Ingreso a ruta de Home de Paciente', async () => {
        const response = await request(app)
            .get('/paciente')
        console.log(response.statusCode)
    })
})

describe('Pruebas de Covertura de decisión', () => {
    test('Autenticación de usuario Valida', async () => {
        const response = await request(app)
            .post('/auth')
            .send(JSON.stringify(userR))
        console.log(response.statusCode)
    })
    test('Autenticación de usuario Invalida', async () => {
        const response = await request(app)
            .post('/auth')
            .send(JSON.stringify(userW))
        console.log(response.text)
    })
})

afterAll(() => {
    connection.end()
    server.close()
})