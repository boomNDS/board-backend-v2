import { Test, TestingModule } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import request from "supertest"
import { AppModule } from "./../src/app.module"
import { describe, beforeEach, afterEach, it } from "vitest"

describe("AppController (e2e)", () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    await app.close()
  })

  it('GET / should return "Hello World!"', async () => {
    await request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect("Hello World!")
  })
})
