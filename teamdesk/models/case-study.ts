import { Base } from "./base";

export interface CaseStudy extends Base {
    case_study_id: string;
    Application: string;
    Confidential: boolean;
    process_id: string;
    country_id: string
    "Function and Key Requirements": string;
    Benefits: string;
    "External Link": string;
    image1_meta: string;
    image2_meta: string;
    image3_meta: string;
    image4_meta: string;
    Last_Modified: Date;
    Visibility: string;
}

export interface CaseStudyFeature extends Base {
    case_study_id: string;
    feature_id: string;
}

export interface CaseStudySegment extends Base {
    case_study_id: string;
    segment_id: string;
}

export interface CaseStudyProduct extends Base {
    cs_id: string;
    pkb_id: string;
}

export interface CaseStudyBC extends Base {
    cs_id: string;
    bc_id: number;
    Visibility: "External" | "Internal"
}
