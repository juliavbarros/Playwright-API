// @ts-check
import { test, expect } from '@playwright/test';
var tokenRecebido

test('Consultando as reservas cadastradas', async ({ request }) => {
  const response = await request.get('/booking');
  console.log(await response.json());
  // Verifica se a resposta foi bem sucedida
  expect(response.ok()).toBeTruthy();
  // Verifica se o status da resposta é 200
  expect(response.status()).toBe(200);
});

test('Consultando as reservas cadastradas com base em um Id', async ({ request }) => {

  const response = await request.get('/booking/775');
  // Transforma o corpo da resposta em JSON
  const responseBody = await response.json(); 
   // Exibe o corpo da resposta no console
  console.log(responseBody);
  //Verificando se os dados da reserva estão corretos
  expect(responseBody.firstname).toBe('Rashedul52110');
  expect(responseBody.lastname).toBe('Islam52110');
  expect(responseBody.totalprice).toBe(52110);
  expect(responseBody.depositpaid).toBeTruthy();
  expect(responseBody.bookingdates.checkin).toBe('2024-01-01');
  expect(responseBody.bookingdates.checkout).toBe('2024-01-02');
  // Verifica se a resposta foi bem sucedida
  expect(response.ok()).toBeTruthy();
  // Verifica se o status da resposta é 200
  expect(response.status()).toBe(200);   
});

test('Consultando as reservas cadastradas com base em um id validando apenas campos', async ({ request }) => {
  const response = await request.get('/booking/775');
  const responseBody = await response.json(); 
  console.log(responseBody);

  //Verificando se os campos estão presentes na resposta da API 
  expect(responseBody).toHaveProperty('firstname');   
  expect(responseBody).toHaveProperty('lastname');
  expect(responseBody).toHaveProperty('totalprice');
  expect(responseBody).toHaveProperty('depositpaid');
  expect(responseBody).toHaveProperty('bookingdates');
  expect(responseBody).toHaveProperty('additionalneeds');

  // Verifica se a resposta foi bem sucedida
  expect(response.ok()).toBeTruthy();
  // Verifica se o status da resposta é 200
  expect(response.status()).toBe(200);
});

test('Cadastrando uma reserva', async ({ request }) => {
  const response = await request.post('/booking', {
    data: {
      "firstname" : "Julia",
      "lastname" : "Brown",
      "totalprice" : 111,
      "depositpaid" : true,
      "bookingdates" : {
          "checkin" : "2018-01-01",
          "checkout" : "2019-01-01"
      },
      "additionalneeds" : "Breakfast"
    }

  });
  console.log(await response.json());
  // Verifica se a resposta foi bem sucedida OK
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.booking).toHaveProperty("firstname", "Julia");
  expect(responseBody.booking).toHaveProperty("lastname", "Brown");
  expect(responseBody.booking).toHaveProperty("totalprice", 111);
  expect(responseBody.booking).toHaveProperty("depositpaid", );

});

test('Gerando um token @regressivo', async ({ request }) => {

  const response = await request.post('/auth',{
    data:{
      "username": "admin",
      "password": "password123"
    }

  });

  console.log(await response.json());
  // Verifica se a resposta foi bem sucedida OK
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  tokenRecebido = responseBody.token;
  console.log("Seu token é:" + tokenRecebido); 

});

test('Atualização parcial', async ({ request }) => {

  const response = await request.post('/auth',{
    data:{
      "username": "admin",
      "password": "password123"
    }

  });

  console.log(await response.json());
  // Verifica se a resposta foi bem sucedida OK
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  tokenRecebido = responseBody.token;
  console.log("Seu token é:" + tokenRecebido); 

  const partialUpdateRequest = await request.patch('/booking/775', {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cookie': `token=${tokenRecebido}`
    },
    data: {
      "firstname": "UpdatedName",
      "lastname": "UpdatedLastName",
      "totalprice": 999,
      "depositpaid": false,
    
    }
  });

  console.log(await partialUpdateRequest.json());
  // Verifica se a resposta foi bem sucedida OK
  expect(partialUpdateRequest.ok()).toBeTruthy();
  expect(partialUpdateRequest.status()).toBe(200);

  const partialUpdatedResponseBody = await partialUpdateRequest.json();
  expect(partialUpdatedResponseBody).toHaveProperty("firstname", "UpdatedName");
  expect(partialUpdatedResponseBody).toHaveProperty("lastname", "UpdatedLastName");
  expect(partialUpdatedResponseBody).toHaveProperty("totalprice", 999);
  expect(partialUpdatedResponseBody).toHaveProperty("depositpaid", false);

});