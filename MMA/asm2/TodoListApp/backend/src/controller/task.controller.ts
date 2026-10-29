import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../middlewares/asyncHandler";
import { taskService } from "../services/task.service";

// Các route task đều đi qua protectedRoute nên request.user luôn có giá trị

export const getTasks: RequestHandler = asyncHandler(async (request, response) => {
    const tasks = await taskService.getTasks(request.user!._id);
    response.status(StatusCodes.OK).json({
        status: "success",
        message: "Get tasks successful",
        data: { tasks },
    });
});

export const getTask: RequestHandler = asyncHandler(async (request, response) => {
    const task = await taskService.getTask(request.user!._id, request.params.id);
    response.status(StatusCodes.OK).json({
        status: "success",
        message: "Get task successful",
        data: { task },
    });
});

export const createTask: RequestHandler = asyncHandler(async (request, response) => {
    const task = await taskService.createTask(request.user!._id, request.body);
    response.status(StatusCodes.CREATED).json({
        status: "success",
        message: "Create task successful",
        data: { task },
    });
});

export const updateTask: RequestHandler = asyncHandler(async (request, response) => {
    const task = await taskService.updateTask(request.user!._id, request.params.id, request.body);
    response.status(StatusCodes.OK).json({
        status: "success",
        message: "Update task successful",
        data: { task },
    });
});

export const toggleTask: RequestHandler = asyncHandler(async (request, response) => {
    const task = await taskService.toggleTask(request.user!._id, request.params.id);
    response.status(StatusCodes.OK).json({
        status: "success",
        message: "Toggle task successful",
        data: { task },
    });
});

export const deleteTask: RequestHandler = asyncHandler(async (request, response) => {
    await taskService.deleteTask(request.user!._id, request.params.id);
    response.status(StatusCodes.OK).json({
        status: "success",
        message: "Delete task successful",
    });
});
