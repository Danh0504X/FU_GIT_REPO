import {
    getQueueService,
    registerTicketService,
    callTicketService,
    completeTicketService
} from "../services/Queue.service.js";
import { handleError } from "../utils/httpError.js";

export const getQueue = async (req, res) => {
    try {
        const tickets = await getQueueService(req.user);

        return res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets
        });
    } catch (error) {
        return handleError(res, error);
    }
};

export const registerTicket = async (req, res) => {
    try {
        const ticket = await registerTicketService(req.body, req.user);

        return res.status(201).json({
            success: true,
            message: "Patient registered to queue successfully",
            data: ticket
        });
    } catch (error) {
        return handleError(res, error);
    }
};

export const callTicket = async (req, res) => {
    try {
        const ticket = await callTicketService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Patient called successfully",
            data: ticket
        });
    } catch (error) {
        return handleError(res, error);
    }
};

export const completeTicket = async (req, res) => {
    try {
        const { ticket, waitMinutes } = await completeTicketService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Patient completed successfully",
            data: ticket,
            waitMinutes
        });
    } catch (error) {
        return handleError(res, error);
    }
};
