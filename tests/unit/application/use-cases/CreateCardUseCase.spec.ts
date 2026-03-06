import { describe, expect, it, vi } from "vitest";
import { CreateCardUseCase } from "../../../../src/application/use-cases/CreateCardUseCase";
import type { UserRepository } from "../../../../src/application/ports/UserRepository";
import type { CardRepository } from "../../../../src/application/ports/CardRepository";
import type { IdGenerator } from "../../../../src/application/ports/IdGenerator";
import { User } from "../../../../src/domain/entities/User";
import { NotFoundError } from "../../../../src/shared/errors/NotFoundError";
import { ValidationError } from "../../../../src/shared/errors/ValidationError";

const makeUser = () =>
  User.create({
    id: "user-1",
    name: "Alice",
    email: "alice@mail.com",
    passwordHash: "hash",
    createdAt: new Date()
  });

const makeUserRepository = (user: ReturnType<typeof makeUser> | null = makeUser()): UserRepository => ({
  findById: vi.fn().mockResolvedValue(user),
  findByEmail: vi.fn(),
  save: vi.fn()
});

const makeCardRepository = (): CardRepository => ({
  findById: vi.fn(),
  findByUserId: vi.fn(),
  save: vi.fn()
});

const makeIdGenerator = (): IdGenerator => ({
  generate: vi.fn().mockReturnValue("card-1")
});

const defaultInput = {
  userId: "user-1",
  cardNumber: "1234123412341234",
  limitCents: 1000
};

describe("CreateCardUseCase", () => {
  it("should create card for existing user", async () => {
    const cardRepository = makeCardRepository();
    const useCase = new CreateCardUseCase(makeUserRepository(), cardRepository, makeIdGenerator());

    const card = await useCase.execute(defaultInput);

    expect(card.id).toBe("card-1");
    expect(card.toJSON().last4).toBe("1234");
    expect(cardRepository.save).toHaveBeenCalledOnce();
  });

  it("should fail when user does not exist", async () => {
    const useCase = new CreateCardUseCase(
      makeUserRepository(null),
      makeCardRepository(),
      makeIdGenerator()
    );

    await expect(useCase.execute(defaultInput)).rejects.toThrow(NotFoundError);
  });

  it("should fail when card number is invalid", async () => {
    const useCase = new CreateCardUseCase(makeUserRepository(), makeCardRepository(), makeIdGenerator());

    await expect(
      useCase.execute({ ...defaultInput, cardNumber: "1234" })
    ).rejects.toThrow(ValidationError);
  });
});