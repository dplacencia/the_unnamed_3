type Merchant = { merchant_id: string; name: string };
type MerchantPage = {
  merchants: readonly Merchant[];
  page: { previous_page_token?: string; next_page_token?: string };
};
type CreateMerchantRequest = {
  caller_operation_id: string;
  name: string;
  creator?: { first_name: string; last_name: string | null };
};
type Readiness = {
  merchant_id: string;
  state: "pending" | "blocked" | "ready";
};
type CreationStatus = {
  kind: "creation";
  request: CreateMerchantRequest;
  merchantId: string;
  state: Readiness["state"] | "unavailable";
};
type UnconfirmedCreation = {
  kind: "creation-unconfirmed";
  request: CreateMerchantRequest;
};

const firstPage: MerchantPage = {
  merchants: [
    { merchant_id: "merchant-huerta", name: "Frutería La Huerta" },
    { merchant_id: "merchant-plaza", name: "Alimentación Plaza" },
  ],
  page: { next_page_token: "merchants-next-2" },
};

export function merchantDiscoveryPage(
  token?: string,
  empty = false,
): MerchantPage | undefined {
  if (!token || token === "merchants-previous-1") {
    return empty ? { merchants: [], page: {} } : firstPage;
  }
  if (token === "merchants-next-2" && !empty) {
    return {
      merchants: [
        { merchant_id: "merchant-mercado", name: "Mercado del barrio" },
      ],
      page: { previous_page_token: "merchants-previous-1" },
    };
  }
}

export function createMerchantRequest(
  name: string,
  operationId: string,
): CreateMerchantRequest | null {
  if (
    !name.isWellFormed() ||
    !/\P{White_Space}/u.test(name) ||
    new TextEncoder().encode(name).length > 255 ||
    !/^[A-Za-z0-9_.-]{1,128}$/.test(operationId)
  ) {
    return null;
  }
  return { caller_operation_id: operationId, name };
}

export function validCreatorName(name: string): boolean {
  if (!name.isWellFormed() || new TextEncoder().encode(name).length > 4096) {
    return false;
  }
  const trimmed = name.replace(/^\p{White_Space}+|\p{White_Space}+$/gu, "");
  return (
    trimmed.length > 0 && [...trimmed].length <= 255 && !/\p{Cc}/u.test(trimmed)
  );
}

export function createMerchantWithCreatorRequest(
  name: string,
  operationId: string,
  firstName: string,
  lastName: string | null,
): CreateMerchantRequest | null {
  const request = createMerchantRequest(name, operationId);
  if (
    !request ||
    !validCreatorName(firstName) ||
    (lastName !== null && !validCreatorName(lastName))
  ) {
    return null;
  }
  return {
    ...request,
    creator: { first_name: firstName, last_name: lastName },
  };
}

export function creationResult(
  request: CreateMerchantRequest,
  response: Readiness | undefined,
): CreationStatus | UnconfirmedCreation {
  if (!response) return { kind: "creation-unconfirmed", request };
  return {
    kind: "creation",
    request,
    merchantId: response.merchant_id,
    state: response.state,
  };
}

export function checkedReadiness(
  creation: CreationStatus,
  response: Readiness | undefined,
): CreationStatus {
  return {
    ...creation,
    state:
      response?.merchant_id === creation.merchantId
        ? response.state
        : "unavailable",
  };
}

export type {
  CreationStatus,
  CreateMerchantRequest,
  Merchant,
  MerchantPage,
  UnconfirmedCreation,
};
