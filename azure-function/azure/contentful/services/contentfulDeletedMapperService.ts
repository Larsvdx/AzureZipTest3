import { BrandMapper } from "../mappers/brand.mapper";
import { ProducerMapper } from "../mappers/producer.mapper";
import { CountryMapper } from "../mappers/country.mapper";
import { ProductMapper } from "../mappers/product.mapper";
import { FeatureMapper } from "../mappers/feature.mapper";
import { FillerMapper } from "../mappers/filler.mapper";
import { QualityMapper } from "../mappers/quality.mapper";
import { PolymerSubgroupMapper } from "../mappers/polymer-subgroup.mapper";
import { SpecificationMapper } from "../mappers/specification.mapper";
import { ProcessMapper } from "../mappers/process.mapper";
import { PolymerGroupMapper } from "../mappers/polymer-group.mapper";
import { PolymerFamilyMapper } from "../mappers/polymer-family.mapper";
import { FormMapper } from "../mappers/form.mapper";
import { SegmentMapper } from "../mappers/segment.mapper";
import { IndustryMapper } from "../mappers/industry.mapper";
import { CaseStudyMapper } from "../mappers/case-study.mapper";
import { Industry } from "../../teamdesk/models/industry";
import { Segment } from "../../teamdesk/models/segment";
import { Producer } from "../../teamdesk/models/producer";
import { Country } from "../../teamdesk/models/country";
import { Feature } from "../../teamdesk/models/feature";
import { Specification } from "../../teamdesk/models/specification";
import { Process } from "../../teamdesk/models/process";
import { Filler } from "../../teamdesk/models/fillers";
import { Form } from "../../teamdesk/models/form";
import { Quality } from "../../teamdesk/models/quality";
import { PolymerFamily } from "../../teamdesk/models/polymer-family";
import { PolymerGroup } from "../../teamdesk/models/polymer-group";
import { PolymerSubgroup } from "../../teamdesk/models/polymer-subgroup";
import { Brand, BrandCountry } from "../../teamdesk/models/brand";
import {
  Product,
  ProductFeature,
  ProductFiller,
  ProductProcess,
  ProductSegment,
  ProductSpecification,
} from "../../teamdesk/models/product";
import {
  CaseStudy,
  CaseStudyBC,
  CaseStudyFeature,
  CaseStudyProduct,
  CaseStudySegment,
} from "../../teamdesk/models/case-study";

export class ContentfulDeletedMapperService {
  private brandMapper: BrandMapper;
  private producerMapper: ProducerMapper;
  private countryMapper: CountryMapper;
  private productMapper: ProductMapper;
  private featureMapper: FeatureMapper;
  private fillerMapper: FillerMapper;
  private qualityMapper: QualityMapper;
  private polymerSubgroupMapper: PolymerSubgroupMapper;
  private specificationMapper: SpecificationMapper;
  private processMapper: ProcessMapper;
  private polymerGroupMapper: PolymerGroupMapper;
  private polymerFamilyMapper: PolymerFamilyMapper;
  private formMapper: FormMapper;
  private segmentMapper: SegmentMapper;
  private industryMapper: IndustryMapper;
  private caseStudyMapper: CaseStudyMapper;

  private productFillers: ProductFiller[];
  private productFeatures: ProductFeature[];
  private productSpecifications: ProductSpecification[];
  private productProcesses: ProductProcess[];
  private productSegment: ProductSegment[];
  private productBrands: Brand[];

  private brandCountries: BrandCountry[];

  private caseStudyFeatures: CaseStudyFeature[];
  private caseStudyProducts: CaseStudyProduct[];
  private caseStudySegments: CaseStudySegment[];
  private caseStudyBC: CaseStudyBC[];

  constructor(spaceId: string, environment: string) {
    this.brandMapper = new BrandMapper(spaceId, environment);
    this.producerMapper = new ProducerMapper(spaceId, environment);
    this.countryMapper = new CountryMapper(spaceId, environment);
    this.productMapper = new ProductMapper(spaceId, environment);
    this.featureMapper = new FeatureMapper(spaceId, environment);
    this.fillerMapper = new FillerMapper(spaceId, environment);
    this.qualityMapper = new QualityMapper(spaceId, environment);
    this.polymerSubgroupMapper = new PolymerSubgroupMapper(
      spaceId,
      environment,
    );
    this.specificationMapper = new SpecificationMapper(spaceId, environment);
    this.processMapper = new ProcessMapper(spaceId, environment);
    this.polymerGroupMapper = new PolymerGroupMapper(spaceId, environment);
    this.polymerFamilyMapper = new PolymerFamilyMapper(spaceId, environment);
    this.formMapper = new FormMapper(spaceId, environment);
    this.segmentMapper = new SegmentMapper(spaceId, environment);
    this.industryMapper = new IndustryMapper(spaceId, environment);
    this.caseStudyMapper = new CaseStudyMapper(spaceId, environment);
  }

  mapper(endpoint: string, data: any[], teamDeskData: any[] | undefined) {
    let entries: any[] = [];
    if (!data) return entries;
    switch (endpoint) {
      case "process": {
        entries = data.map((process: Process) =>
          this.processMapper.map(process),
        );
        break;
      }
      case "industry": {
        entries = data.map((industry: Industry) =>
          this.industryMapper.map(industry),
        );
        break;
      }
      case "segment": {
        entries = data.map((segment: Segment) =>
          this.segmentMapper.map(segment),
        );
        break;
      }
      case "producer": {
        entries = data.map((producer: Producer) =>
          this.producerMapper.map(producer),
        );
        break;
      }
      case "country": {
        entries = data.map((country: Country) =>
          this.countryMapper.map(country),
        );
        break;
      }
      case "feature": {
        entries = data.map((feature: Feature) =>
          this.featureMapper.map(feature),
        );
        break;
      }
      case "specification": {
        entries = data.map((specification: Specification) =>
          this.specificationMapper.map(specification, []),
        );
        break;
      }
      case "filler": {
        entries = data.map((filler: Filler) => this.fillerMapper.map(filler));
        break;
      }
      case "form": {
        entries = data.map((form: Form) => this.formMapper.map(form));
        break;
      }
      case "productFiller": {
        entries = data.map((productFiller: ProductFiller) =>
          this.fillerMapper.mapProductFillers(productFiller),
        );
        this.productFillers = teamDeskData;
        break;
      }
      case "productSpecification": {
        this.productSpecifications = teamDeskData;
        break;
      }
      case "productFeature": {
        this.productFeatures = teamDeskData;
        break;
      }
      case "productProcess": {
        this.productProcesses = teamDeskData;
        break;
      }
      case "productSegment": {
        this.productSegment = teamDeskData;
        break;
      }
      case "quality": {
        entries = data.map((quality: Quality) =>
          this.qualityMapper.map(quality),
        );
        break;
      }
      case "polymerGroup": {
        entries = data.map((polymerGroup: PolymerGroup) =>
          this.polymerGroupMapper.map(polymerGroup),
        );
        break;
      }
      case "polymerSubgroup": {
        entries = data.map((polymerSubgroup: PolymerSubgroup) =>
          this.polymerSubgroupMapper.map(polymerSubgroup),
        );
        break;
      }
      case "polymerFamily": {
        entries = data.map((polymerFamily: PolymerFamily) =>
          this.polymerFamilyMapper.map(polymerFamily),
        );
        break;
      }
      case "brandCountry": {
        this.brandCountries = teamDeskData;
        break;
      }
      case "brand": {
        if (this.brandCountries) {
          entries = data.map((brand: Brand) =>
            this.brandMapper.map(
              brand,
              this.brandCountries.filter(
                (brandCountry: BrandCountry) =>
                  brandCountry.brand_id === brand.brand_id,
              ),
            ),
          );
        }
        break;
      }
      case "product": {
        if (
          this.productFillers &&
          this.productFeatures &&
          this.productSpecifications &&
          this.productProcesses &&
          this.productSegment &&
          this.productBrands
        ) {
          entries = data.map((product: Product) =>
            this.productMapper.map(
              product,
              this.productFillers.filter(
                (productFiller: ProductFiller) =>
                  productFiller.pkb_id === product.pkb_id,
              ),
              this.productFeatures.filter(
                (productFeature: ProductFeature) =>
                  productFeature.pkb_id === product.pkb_id,
              ),
              this.productSpecifications.filter(
                (productSpecification: ProductSpecification) =>
                  productSpecification["pkb id"] === product.pkb_id,
              ),
              this.productProcesses.filter(
                (productProcess: ProductProcess) =>
                  productProcess.pkb_id === product.pkb_id,
              ),
              this.productSegment.filter(
                (productSegment: ProductSegment) =>
                  productSegment.pkb_id === product.pkb_id,
              ),
              this.productBrands.find(
                (productBrand: Brand) =>
                  productBrand.brand_id === product.brand_id,
              ),
            ),
          );
        }
        break;
      }
      case "caseStudyFeature": {
        this.caseStudyFeatures = teamDeskData;
        break;
      }
      case "caseStudySegment": {
        this.caseStudySegments = teamDeskData;
        break;
      }
      case "caseStudyProduct": {
        this.caseStudyProducts = teamDeskData;
        break;
      }
      case "caseStudyBC": {
        this.caseStudyBC = teamDeskData;
        break;
      }
      case "caseStudy": {
        if (
          this.caseStudyFeatures &&
          this.caseStudyProducts &&
          this.caseStudyBC &&
          this.caseStudySegments
        ) {
          const filteredCaseStudies = data
            .filter((cs) =>
              this.caseStudyBC.some(
                (csb) => csb.cs_id === cs.case_study_id && csb.bc_id === 2,
              ),
            )
            .map((cs) => {
              const matchingBC = this.caseStudyBC.find(
                (csb) => csb.cs_id === cs.case_study_id && csb.bc_id === 2,
              );
              return { ...cs, Visibility: matchingBC.Visibility };
            });

          entries = filteredCaseStudies?.map((caseStudy: CaseStudy) => {
            return this.caseStudyMapper?.map(
              caseStudy,
              this.caseStudyFeatures.filter(
                (caseStudyFeature: CaseStudyFeature) =>
                  caseStudyFeature.case_study_id === caseStudy.case_study_id,
              ),
              this.caseStudyProducts.filter(
                (caseStudyProduct: CaseStudyProduct) =>
                  caseStudyProduct.cs_id === caseStudy.case_study_id,
              ),
              this.caseStudySegments.filter(
                (caseStudySegment: CaseStudySegment) =>
                  caseStudySegment.case_study_id === caseStudy.case_study_id,
              ),
            );
          });
        }
        break;
      }
      default: {
        entries = [];
        break;
      }
    }
    return entries;
  }

  map(
    input: {
      endpoint: any;
      diff: { deletedJson: any[]; newJson: any[] };
      teamDeskData: any[];
    }[],
  ) {
    const brand = input.find((data) => data.endpoint === "brand");
    this.productBrands = brand ? brand.teamDeskData : undefined;

    const data = input ? input.filter((data) => data.diff) : [];
    const aggregateEndpoints = ["product", "brand", "caseStudy"];

    const entries: any[] = [];

    if (data.length > 0) {
      data.sort((dataPoint) =>
        aggregateEndpoints.includes(dataPoint.endpoint) ? 1 : -1,
      );
      data.forEach((dataPoint) => {
        const mapped = this.mapper(
          dataPoint.endpoint,
          dataPoint.diff.deletedJson,
          dataPoint.teamDeskData.length > 0
            ? dataPoint.teamDeskData
            : undefined,
        );

        if (mapped && mapped.length > 0) entries.push(...mapped);
      });
    }

    return {
      tags: [],
      entries: entries,
      assets: [],
    };
  }
}
