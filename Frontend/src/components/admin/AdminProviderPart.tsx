"use client";

import { type AdminBlogPost, type AdminClient, type AdminContactMessage, type AdminDemoState, type AdminEmployee, type AdminFaq, type AdminFile, type AdminInvoice, type AdminSalarySlip, type AdminLead, type AdminLeadFollowUp, type AdminMessage, type AdminPortfolioItem, type AdminProject, type AdminSale, type AdminSalesMessage, type AdminService, type AdminTeamMember, type AdminSiteGalleryImage, type AdminSiteTestimonial, type AdminSitePrinciple } from "@/lib/data/admin";
import type { ProjectStatus } from "@/constants/admin";
import type { AdminDomain, AdminDomainPayload } from "@/lib/portal/types";

export type AdminIdentity = {
  readonly name: string;
  readonly email: string;
  readonly initials: string;
  readonly image: string;
};

export type AdminLoadedDomains = Record<AdminDomain, boolean>;

export type AdminContextValue = {
  readonly identity: AdminIdentity;
  readonly setIdentity: (identity: {
    readonly name: string;
    readonly email: string;
    readonly image?: string;
  }) => void;
  readonly state: AdminDemoState;
  readonly isDomainLoaded: (domain: AdminDomain) => boolean;
  readonly ensureDomain: (domain: AdminDomain) => Promise<void>;
  readonly applyDomainPayload: (payload: AdminDomainPayload) => void;
  readonly setServices: (items: AdminService[]) => void;
  readonly setPortfolio: (items: AdminPortfolioItem[]) => void;
  readonly setBlog: (items: AdminBlogPost[]) => void;
  readonly setFaqs: (items: AdminFaq[]) => void;
  readonly setTeam: (items: AdminTeamMember[]) => void;
  readonly setSiteGallery: (items: AdminSiteGalleryImage[]) => void;
  readonly setSiteTestimonials: (items: AdminSiteTestimonial[]) => void;
  readonly setSitePrinciples: (items: AdminSitePrinciple[]) => void;
  readonly setEmployees: (items: AdminEmployee[]) => void;
  readonly setClients: (items: AdminClient[]) => void;
  readonly setProjects: (items: AdminProject[]) => void;
  readonly setMessages: (items: AdminMessage[]) => void;
  readonly setInvoices: (items: AdminInvoice[]) => void;
  readonly setSalarySlips: (items: AdminSalarySlip[]) => void;
  readonly setFiles: (items: AdminFile[]) => void;
  readonly setContactMessages: (items: AdminContactMessage[]) => void;
  readonly setSales: (items: AdminSale[]) => void;
  readonly setLeads: (items: AdminLead[]) => void;
  readonly setLeadFollowUps: (items: AdminLeadFollowUp[]) => void;
  readonly setSalesMessages: (items: AdminSalesMessage[]) => void;
  readonly updateProjectStatus: (id: string, status: ProjectStatus) => void;
  readonly assignEmployees: (clientId: string, employeeIds: string[]) => void;
};
