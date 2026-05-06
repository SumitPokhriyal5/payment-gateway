import { NextResponse } from "next/server";
import {
  SUCCESS_RATE,
  FAILURE_RATE,
  SERVER_TIMEOUT_DELAY_MS,
  FAILURE_REASONS,
} from "@/utils/constants";
import type { GatewayResponse, PaymentPayload } from "@/types";

type Outcome = "success" | "failed" | "timeout";

function pickOutcome(): Outcome {
  const roll = Math.random();
  if (roll < SUCCESS_RATE) return "success";
  if (roll < SUCCESS_RATE + FAILURE_RATE) return "failed";
  return "timeout";
}

function pickFailureReason(): string {
  const index = Math.floor(Math.random() * FAILURE_REASONS.length);
  return FAILURE_REASONS[index] ?? "Payment failed";
}

function isValidPayload(body: unknown): body is PaymentPayload {
  if (!body || typeof body !== "object") return false;
  const p = body as Record<string, unknown>;
  return (
    typeof p.transactionId === "string" &&
    typeof p.cardholderName === "string" &&
    typeof p.cardNumber === "string" &&
    typeof p.expiry === "string" &&
    typeof p.cvv === "string" &&
    typeof p.amount === "number" &&
    (p.currency === "INR" || p.currency === "USD")
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  if (!isValidPayload(body)) {
    return NextResponse.json(
      { error: "Invalid payment payload" },
      { status: 400 }
    );
  }

  const outcome = pickOutcome();

  if (outcome === "timeout") {
    await delay(SERVER_TIMEOUT_DELAY_MS);
    const response: GatewayResponse = {
      outcome: "success",
      transactionId: body.transactionId,
    };
    return NextResponse.json(response);
  }

  if (outcome === "success") {
    const response: GatewayResponse = {
      outcome: "success",
      transactionId: body.transactionId,
    };
    return NextResponse.json(response);
  }

  const response: GatewayResponse = {
    outcome: "failed",
    transactionId: body.transactionId,
    reason: pickFailureReason(),
  };
  return NextResponse.json(response);
}
