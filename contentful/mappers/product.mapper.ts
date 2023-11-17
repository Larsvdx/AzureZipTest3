import { generateContentfulId } from "../../util/contentful.util";
import {
  Product,
  ProductFeature,
  ProductFiller,
  ProductProcess,
  ProductSegment,
  ProductSpecification,
} from "../../teamdesk/models/product";
import { Brand } from "../../teamdesk/models/brand";
import {ContentfulMapper} from "./base/contentful.mapper";

export class ProductMapper {
  private spaceId: string;
  private environment: string;

  constructor(spaceId: string, environment: string) {
    this.spaceId = spaceId;
    this.environment = environment;
  }

  map(
    product: Product,
    productFillers: Array<ProductFiller>,
    productFeatures: Array<ProductFeature>,
    productSpecifications: Array<ProductSpecification>,
    productProcesses: Array<ProductProcess>,
    productSegments: Array<ProductSegment>,
    brand: Brand
  ): any {
    return ContentfulMapper
        .createContentModelBase(this.spaceId, this.environment, 'product', product.pkb_id)
        .addFields({
          name: {
            en: `${brand.Brand} ${product.Grade}`,
          },
          slug: {
            en: `${product.pkb_id}-${brand.Brand.replace(/ /g,'-').toLowerCase()}-${product.Grade.replace(/ /g,'-').toLowerCase()}`,
          },
          grade: {
            en: product.Grade,
          },
          description: {
            en: product.Description,
          },
          ulPortfolio: {
            en: product.UL_in_portfolio,
          },
          ulProductId: {
            en: product["UL product_id"],
          },
          isPreferred: {
            en: product.Preferred
          },
          ranking: {
            en: product.rank_prd
          },
          modifiedAt: {
            en: product.Date_Modified_All_product ? new Date(product.Date_Modified_All_product) : null
          },
          brand: {
            en: {
              sys: {
                type: "Link",
                linkType: "Entry",
                id: generateContentfulId("brand", product.brand_id),
              },
            },
          },
          quality: {
            en: {
              sys: {
                type: "Link",
                linkType: "Entry",
                id: generateContentfulId("quality", product.quality_id),
              },
            },
          },
          form: {
            en: {
              sys: {
                type: "Link",
                linkType: "Entry",
                id: generateContentfulId("form", product.form_id),
              },
            },
          },
          polymerSubgroup: {
            en: {
              sys: {
                type: "Link",
                linkType: "Entry",
                id: generateContentfulId("polymer-subgroup", product.subgroup_id),
              },
            },
          },
          fillers: { en: this.mapProductFillers(productFillers) },
          features: { en: this.mapProductFeatures(productFeatures) },
          specifications: {
            en: this.mapProductSpecifications(productSpecifications),
          },
          processes: { en: this.mapProductProcesses(productProcesses) },
          industrySegments: { en: this.mapProductSegments(productSegments) },
        })
        .build();
  }

  private mapProductFillers(productFillers: Array<ProductFiller>) {
    const result: any[] = [];
    productFillers.forEach((x) => {
      result.push({
        sys: {
          type: "Link",
          linkType: "Entry",
          id: generateContentfulId("product-filler", x["@row.id"]),
        }
      });
    });
    return result;
  }

  private mapProductFeatures(productFeatures: Array<ProductFeature>) {
    const result: any[] = [];
    productFeatures.forEach((x) => {
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

  private mapProductSpecifications(
    productSpecifications: Array<ProductSpecification>
  ) {
    const result: any[] = [];
    productSpecifications.forEach((x) => {
      result.push({
        sys: {
          type: "Link",
          linkType: "Entry",
          id: generateContentfulId("specification", x["specification id"]),
        },
      });
    });
    return result;
  }

  private mapProductProcesses(productSpecifications: Array<ProductProcess>) {
    const result: any[] = [];
    productSpecifications.forEach((x) => {
      result.push({
        sys: {
          type: "Link",
          linkType: "Entry",
          id: generateContentfulId("process", x.process_id),
        },
      });
    });
    return result;
  }

  private mapProductSegments(productSegments: Array<ProductSegment>) {
    const result: any[] = [];
    productSegments.forEach((x) => {
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
}
