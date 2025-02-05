import { AuthService } from "@/services/auth-service";
import {
  EditUserRole,
  GetUsersResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateUserRoleResponse,
} from "@/types/auth.type";

// Mock the apiRequest function
const mockApiRequest = jest.fn();

// Create an instance of AuthService with the mocked apiRequest
const service = new AuthService(mockApiRequest);

describe("AuthService", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  //TODO:
  // describe("constructUrl", () => {
  //   it("should construct a valid URL", () => {
  //     const endpoint = "/register";
  //     const expectedUrl = "http://localhost:5000/api/v1/auth/register";
  //     const result = service.constructUrl(endpoint);
  //     expect(result).toEqual(expectedUrl);
  //   });

  //   it("should throw an error if NEXT_PUBLIC_API_URL is not defined", () => {
  //     process.env.NEXT_PUBLIC_API_URL = undefined;
  //     expect(() => service.constructUrl("/register")).toThrow();
  //   });
  // });

  // Test case for getAllClerkUsers
  describe("getAllClerkUsers", () => {
    it("should fetch all users", async () => {
      const mockResponse: GetUsersResponse = {
        success: true,
        count: 10,
        pagination: {
          limit: 10,
          offset: 0,
          totalPages: null,
          currentPage: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
        data: [
          {
            id: "abc_123123123",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            role: "user",
            createdAt: 1234567890,
            lastSignInAt: 1234567890,
            username: "john.doe",
          },
        ],
      };

      // Mock the apiRequest response
      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await service.getAllClerkUsers();

      expect(mockApiRequest).toHaveBeenCalledWith(
        "http://localhost:5000/api/v1/auth"
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle errors when fetching users", async () => {
      const mockError = new Error("Failed to fetch users");

      // Mock the apiRequest to throw an error
      mockApiRequest.mockRejectedValue(mockError);

      await expect(service.getAllClerkUsers()).rejects.toThrow(mockError);
    });
  });

  // Test case for registerUser
  describe("registerUser", () => {
    it("should register a new user", async () => {
      const mockRequest: RegisterRequest = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        confirmPassword: "password123",
        role: "user",
        username: "john.doe",
      };

      const mockResponse: RegisterResponse = {
        success: true,
        user: {
          id: "abc_123123123",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          role: "user",
          username: "john.doe",
        },
      };

      // Mock the apiRequest response
      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await service.registerUser(mockRequest);

      expect(mockApiRequest).toHaveBeenCalledWith(
        "http://localhost:5000/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockRequest),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle errors when registering a user", async () => {
      const mockRequest: RegisterRequest = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        confirmPassword: "password123",
        role: "user",
        username: "john.doe",
      };

      const mockError = new Error("Failed to register user");

      // Mock the apiRequest to throw an error
      mockApiRequest.mockRejectedValue(mockError);

      await expect(service.registerUser(mockRequest)).rejects.toThrow(
        mockError
      );
    });
  });

  // Test case for updateUserRole
  describe("updateUserRole", () => {
    it("should update a user's role", async () => {
      const mockRequest: EditUserRole = {
        userId: "1",
        role: "admin",
      };

      const mockResponse: UpdateUserRoleResponse = {
        success: true,
        message: "User role updated successfully",
        data: {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          role: "admin",
          username: "john.doe",
        },
      };

      // Mock the apiRequest response
      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await service.updateUserRole(mockRequest);

      expect(mockApiRequest).toHaveBeenCalledWith(
        "http://localhost:5000/api/v1/auth/1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: "admin" }),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle errors when updating a user's role", async () => {
      const mockRequest: EditUserRole = {
        userId: "1",
        role: "admin",
      };

      const mockError = new Error("Failed to update user role");

      // Mock the apiRequest to throw an error
      mockApiRequest.mockRejectedValue(mockError);

      await expect(service.updateUserRole(mockRequest)).rejects.toThrow(
        mockError
      );
    });
  });
});
