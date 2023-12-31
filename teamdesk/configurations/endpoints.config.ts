import {EndPointInterface} from "../../shared/models/general";

export const endPoints: EndPointInterface[] = [
    {
        resource: "process",
        url: "/Process/API_process/select.json?skip={{skip}}",
    },
    {
        resource: "product",
        url: "/Product_BC/API_Products/select.json?filter=Contains([bc_code], '{{businessContext}}')&skip={{skip}}",
    },
    {
        resource: "feature",
        url: "/Special%20Features/API_special_feature/select.json?skip={{skip}}",
    },
    {
        resource: "quality",
        url: "/Codes/API_quality/select.json?skip={{skip}}",
    },
    {
        resource: "filler",
        url: "/Fillers/API_fillers/select.json?skip={{skip}}",
    },
    {
        resource: "specification",
        url: "/Specifications/API_specifications/select.json?skip={{skip}}",
    },
    {
        resource: "provider",
        url: "/specification%20provider/API_Specification_Provider/select.json?skip={{skip}}",
    },
    {
        resource: "productFiller",
        url: "/Product%20Fillers/API_filler_product/select.json?filter=Contains([bc_code], '{{businessContext}}')&skip={{skip}}",
    },
    {
        resource: "productFeature",
        url: "/Product%20Features/API_product_features/select.json?filter=Contains([bc_code], '{{businessContext}}')&skip={{skip}}",
    },
    {
        resource: "productSpecification",
        url: "/product%20specifications/API_product_specifications/select.json?filter=Contains([bc_code], '{{businessContext}}')&skip={{skip}}",
    },
    {
        resource: "productProcess",
        url: "/Product%20Process/API_process_product/select.json?filter=Contains([bc_code], '{{businessContext}}')&skip={{skip}}",
    },
    {
        resource: "productSegment",
        url: "/Product%20Segments/API_product_segments/select.json?filter=Contains([bc_code], '{{businessContext}}')&skip={{skip}}",
    },
    {
        resource: "producer",
        url: "/Producers/API_producer/select.json?filter=Contains([bc_code], '{{businessContext}}')&skip={{skip}}",
    },
    {
        resource: "brand",
        url: "/Brand/API_brand/select.json?filter=Contains([bc_code], '{{businessContext}}')&skip={{skip}}",
    },
    {
        resource: "brandCountry",
        url: "/Brand%20Country%20BC/API_brand_country_BC/select.json?filter=Contains([bc_code], '{{businessContext}}')&skip={{skip}}",
    },
    {
        resource: "country",
        url: "/Selling%20Country/API_countries/select.json?skip={{skip}}",
    },
    {
        resource: "polymerSubgroup",
        url: "/polymer%20subgroup/API_polymer_subgroup/select.json?skip={{skip}}",
    },
    {
        resource: "polymerGroup",
        url: "/Polymer%20Group/API_polymer_group/select.json?skip={{skip}}",
    },
    {
        resource: "polymerFamily",
        url: "/polymer%20family/API_polymer_family/select.json?skip={{skip}}",
    },
    {
        resource: "form",
        url: "/Codes/API_forms/select.json?skip={{skip}}",
    },
    {
        resource: "segment",
        url: "/Industry%20Segment/API_segments/select.json?skip={{skip}}",
    },
    {
        resource: "industry",
        url: "/Industry/API_industry/select.json?skip={{skip}}",
    },
    {
        resource: "caseStudy",
        url: "/Case%20Study/API_casestudies/select.json?filter=Contains([bc_code], '{{businessContext}}')&skip={{skip}}",
    },
    {
        resource: "caseStudyFeature",
        url: "/Case%20Study%20Features/API_casestudy_feature/select.json?filter=Contains([bc_code], '{{businessContext}}')&skip={{skip}}",
    },
    {
        resource: "caseStudySegment",
        url: "/Case%20Study%20Segment/API_casestudy_segment/select.json?filter=Contains([bc_code], '{{businessContext}}')&skip={{skip}}",
    },
    {
        resource: "caseStudyProduct",
        url: "/Case%20Study%20Products/API_casestudy_product/select.json?filter=Contains([bc_code], '{{businessContext}}')&skip={{skip}}",
    },
    {
        resource: "caseStudyBC",
        url: "/Case_Study_BC/API_casestudy_bc/select.json?skip={{skip}}",
    },
];