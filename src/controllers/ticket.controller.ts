import { Request, Response, NextFunction } from 'express';
import { ticketService } from '../services/ticket.service';

export class TicketController {
  async generarTicket(req: Request, res: Response, next: NextFunction) {
    try {
      await ticketService.generarTicket(req.params.id, res);
    } catch (error) {
      next(error);
    }
  }
}

export const ticketController = new TicketController();
