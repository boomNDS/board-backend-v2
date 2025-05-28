import { Test, TestingModule } from "@nestjs/testing"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { describe, beforeEach, expect, it } from "vitest"

describe("AppController", () => {
  let appController: AppController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useClass: AppService,
        },
      ],
    }).compile()

    appController = module.get<AppController>(AppController)
  })

  describe("root", () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe("Hello World!")
    })
  })
})
