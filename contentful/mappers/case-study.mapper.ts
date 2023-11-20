import {
  CaseStudy,
  CaseStudyFeature,
  CaseStudyProduct,
  CaseStudySegment,
} from "../../teamdesk/models/case-study";
import { generateContentfulId } from "../../util/contentful.util";
import { ContentfulMapper } from "./base/contentful.mapper";

export class CaseStudyMapper {
  private spaceId: string;
  private environment: string;

  constructor(spaceId: string, environment: string) {
    this.spaceId = spaceId;
    this.environment = environment;
  }

  map(
    caseStudy: CaseStudy,
    caseStudyFeatures: Array<CaseStudyFeature>,
    caseStudyProducts: Array<CaseStudyProduct>,
    caseStudySegments: Array<CaseStudySegment>
  ) {
    return ContentfulMapper.createContentModelBase(
      this.spaceId,
      this.environment,
      "caseStudy",
      caseStudy.case_study_id
    )
      .addFields({
        title: {
          en: caseStudy.Application,
        },
        slug: {
          en: `${caseStudy.case_study_id}-${caseStudy.Application.replace(
            / /g,
            "-"
          ).toLowerCase()}`,
        },
        confidential: {
          en: caseStudy.Confidential,
        },
        visibility: {
          en: caseStudy.Visibility,
        },
        functionKeyRequirements: {
          en: caseStudy["Function and Key Requirements"],
        },
        benefits: {
          en: caseStudy.Benefits,
        },
        link: {
          en: caseStudy["External Link"],
        },
        processingMethod: {
          en: {
            sys: {
              type: "Link",
              linkType: "Entry",
              id: generateContentfulId("process", caseStudy.process_id),
            },
          },
        },
        features: { en: this.mapCaseStudyFeatures(caseStudyFeatures) },
        segments: { en: this.mapCaseStudySegments(caseStudySegments) },
        products: { en: this.mapCaseStudyProducts(caseStudyProducts) },
      })
      .build();
  }

  private mapCaseStudyFeatures(caseStudyFeatures: Array<CaseStudyFeature>) {
    const result: any[] = [];
    caseStudyFeatures.forEach((x) => {
      result.push({
        sys: {
          type: "Link",
          linkType: "Entry",
          id: generateContentfulId("feature", x.feature_id),
        },
      });
    });
    return result;
  }

  private mapCaseStudySegments(caseStudySegments: Array<CaseStudySegment>) {
    const result: any[] = [];
    caseStudySegments.forEach((x) => {
      result.push({
        sys: {
          type: "Link",
          linkType: "Entry",
          id: generateContentfulId("segment", x.segment_id),
        },
      });
    });
    return result;
  }

  private mapCaseStudyProducts(caseStudyProducts: Array<CaseStudyProduct>) {
    const result: any[] = [];
    caseStudyProducts.forEach((x) => {
      result.push({
        sys: {
          type: "Link",
          linkType: "Entry",
          id: generateContentfulId("product", x.pkb_id),
        },
      });
    });
    return result;
  }
}
