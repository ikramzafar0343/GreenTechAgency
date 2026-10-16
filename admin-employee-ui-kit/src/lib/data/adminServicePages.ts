export type {
  ServicePageCollection,
  AdminServicePageListItem,
  AdminServicePageOffering,
  AdminServicePageBuildItem,
  AdminServicePageProcessStep,
  AdminServicePageTechnology,
  AdminServicePageBenefit,
  AdminServicePageFaq,
  AdminServicePageRelated,
  AdminServicePageDetail,
  AdminServicePageChild,
} from "@/lib/portal/types";
export class ContractValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContractValidationError";
  }
}
