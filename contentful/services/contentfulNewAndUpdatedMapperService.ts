import { readJsonFile } from '../../util/filesystem.util';
import { BrandMapper } from '../mappers/brand.mapper';
import { ProducerMapper } from '../mappers/producer.mapper';
import { CountryMapper } from '../mappers/country.mapper';
import { ProductMapper } from '../mappers/product.mapper';
import { FeatureMapper } from '../mappers/feature.mapper';
import { FillerMapper } from '../mappers/filler.mapper';
import { QualityMapper } from '../mappers/quality.mapper';
import { PolymerSubgroupMapper } from '../mappers/polymer-subgroup.mapper';
import { SpecificationMapper } from '../mappers/specification.mapper';
import { ProcessMapper } from '../mappers/process.mapper';
import { PolymerGroupMapper } from '../mappers/polymer-group.mapper';
import { PolymerFamilyMapper } from '../mappers/polymer-family.mapper';
import { FormMapper } from '../mappers/form.mapper';
import { SegmentMapper } from '../mappers/segment.mapper';
import { IndustryMapper } from '../mappers/industry.mapper';
import {CaseStudyMapper} from "../mappers/case-study.mapper";
import {Industry} from "../../teamdesk/models/industry";
import {Segment} from "../../teamdesk/models/segment";
import {Producer} from "../../teamdesk/models/producer";
import {Country} from "../../teamdesk/models/country";
import {Feature} from "../../teamdesk/models/feature";
import {Provider, Specification} from "../../teamdesk/models/specification";
import {Process} from "../../teamdesk/models/process";
import {Filler} from "../../teamdesk/models/fillers";
import {Form} from "../../teamdesk/models/form";
import {Quality} from "../../teamdesk/models/quality";
import {PolymerFamily} from "../../teamdesk/models/polymer-family";
import {PolymerGroup} from "../../teamdesk/models/polymer-group";
import {PolymerSubgroup} from "../../teamdesk/models/polymer-subgroup";
import {Brand, BrandCountry} from "../../teamdesk/models/brand";
import {
    Product,
    ProductFeature,
    ProductFiller,
    ProductProcess, ProductSegment,
    ProductSpecification
} from "../../teamdesk/models/product";
import {CaseStudy, CaseStudyFeature, CaseStudyProduct, CaseStudySegment} from "../../teamdesk/models/case-study";

export class ContentfulNewAndUpdatedMapperService {
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

    constructor(spaceId: string, environment: string) {
        this.brandMapper = new BrandMapper(spaceId, environment);
        this.producerMapper = new ProducerMapper(spaceId, environment);
        this.countryMapper = new CountryMapper(spaceId, environment);
        this.productMapper = new ProductMapper(spaceId, environment);
        this.featureMapper = new FeatureMapper(spaceId, environment);
        this.fillerMapper = new FillerMapper(spaceId, environment)
        this.qualityMapper = new QualityMapper(spaceId, environment);
        this.polymerSubgroupMapper = new PolymerSubgroupMapper(spaceId, environment);
        this.specificationMapper = new SpecificationMapper(spaceId, environment);
        this.processMapper = new ProcessMapper(spaceId, environment);
        this.polymerGroupMapper = new PolymerGroupMapper(spaceId, environment);
        this.polymerFamilyMapper = new PolymerFamilyMapper(spaceId, environment);
        this.formMapper = new FormMapper(spaceId, environment);
        this.segmentMapper = new SegmentMapper(spaceId, environment);
        this.industryMapper = new IndustryMapper(spaceId, environment);
        this.caseStudyMapper = new CaseStudyMapper(spaceId, environment);
    }

    map() {
        const industries = readJsonFile('sync/exports/industry', 'data.diff.json');
        const mappedIndustries = industries.newAndUpdated?.map((industry: Industry) => this.industryMapper.map(industry));

        const segments = readJsonFile('sync/exports/segment', 'data.diff.json');
        const mappedSegments = segments.newAndUpdated?.map((segment: Segment) => this.segmentMapper.map(segment));

        const producers = readJsonFile('sync/exports/producer', 'data.diff.json');
        const mappedProducers = producers.newAndUpdated?.map((producer: Producer) => this.producerMapper.map(producer));

        const countries = readJsonFile('sync/exports/country', 'data.diff.json');
        const mappedCountries = countries.newAndUpdated?.map((country: Country) => this.countryMapper.map(country));

        const features = readJsonFile('sync/exports/feature', 'data.diff.json');
        const mappedFeatures = features.newAndUpdated?.map((feature: Feature) => this.featureMapper.map(feature));

        const providers = readJsonFile('sync/exports/provider', 'data.json');
        const specifications = readJsonFile('sync/exports/specification', 'data.diff.json');
        const mappedSpecification = specifications.newAndUpdated?.map((specification: Specification) => this.specificationMapper.map(specification, providers.filter((provider: Provider) => provider["Provider Id"] === specification["Provider id"])));

        const processes = readJsonFile('sync/exports/process', 'data.diff.json');
        const mappedProcesses = processes.newAndUpdated?.map((process: Process) => this.processMapper.map(process));

        const fillers = readJsonFile('sync/exports/filler', 'data.diff.json');
        const mappedFillers = fillers.newAndUpdated?.map((filler: Filler) => this.fillerMapper.map(filler));

        const forms = readJsonFile('sync/exports/form', 'data.diff.json');
        const mappedForms = forms.newAndUpdated?.map((form: Form) => this.formMapper.map(form));

        const productFillers = readJsonFile('sync/exports/productfiller', 'data.json');
        const mappedProductFillers = productFillers.map((productFiller: ProductFiller) => this.fillerMapper.mapProductFillers(productFiller));

        const productFeatures = readJsonFile('sync/exports/productfeature', 'data.json');
        const productSpecifications = readJsonFile('sync/exports/productspecification', 'data.json');
        const productProcesses = readJsonFile('sync/exports/productprocess', 'data.json');
        const productSegment = readJsonFile('sync/exports/productsegment', 'data.json');
        const productBrands = readJsonFile('sync/exports/brand', 'data.json');
        const qualities = readJsonFile('sync/exports/quality', 'data.diff.json');
        const mappedQualities = qualities.newAndUpdated?.map((quality: Quality) => this.qualityMapper.map(quality));

        const polymerFamily = readJsonFile('sync/exports/polymerfamily', 'data.diff.json');
        const mappedPolymerFamily = polymerFamily.newAndUpdated?.map((polymerFamily: PolymerFamily) => this.polymerFamilyMapper.map(polymerFamily));

        const polymerGroups = readJsonFile('sync/exports/polymerGroup', 'data.diff.json');
        const mappedPolymerGroups = polymerGroups.newAndUpdated?.map((polymerGroup: PolymerGroup) => this.polymerGroupMapper.map(polymerGroup));

        const polymerSubgroups = readJsonFile('sync/exports/polymersubgroup', 'data.diff.json');
        const mappedPolymerSubgroups = polymerSubgroups.newAndUpdated?.map((polymerSubgroup: PolymerSubgroup) => this.polymerSubgroupMapper.map(polymerSubgroup));

        const brands = readJsonFile('sync/exports/brand', 'data.json');
        const brandCountries = readJsonFile('sync/exports/brandcountry', 'data.json');
        const mappedBrands = brands.map((brand: Brand) => {
            return this.brandMapper.map(brand, brandCountries.filter((brandCountry: BrandCountry) => brandCountry.brand_id === brand.brand_id));
        });

        const products = readJsonFile('sync/exports/product', 'data.json');
        const mappedProducts = products.map((product: Product) => {
            return this.productMapper?.map(
                product,
                productFillers.filter((productFiller: ProductFiller) => productFiller.pkb_id === product.pkb_id),
                productFeatures.filter((productFeature: ProductFeature) => productFeature.pkb_id === product.pkb_id),
                productSpecifications.filter((productSpecification: ProductSpecification) => productSpecification['pkb id'] === product.pkb_id),
                productProcesses.filter((productProcess: ProductProcess) => productProcess.pkb_id === product.pkb_id),
                productSegment.filter((productSegment: ProductSegment) => productSegment.pkb_id === product.pkb_id),
                productBrands.find((productBrand: Brand) => productBrand.brand_id === product.brand_id),
            );
        });

        const caseStudyFeatures = readJsonFile('sync/exports/casestudyfeature', 'data.json');
        const caseStudyProducts = readJsonFile('sync/exports/casestudyproduct', 'data.json');
        const caseStudySegments = readJsonFile('sync/exports/casestudysegment', 'data.json');

        const caseStudiesBC = readJsonFile('sync/exports/casestudybc', 'data.json');
        const caseStudies = readJsonFile('sync/exports/casestudy', 'data.json');

        const filteredCaseStudies = caseStudies.filter(cs =>
            caseStudiesBC.some(csb => csb.cs_id === cs.case_study_id && csb.bc_id === 2)
        ).map(cs => {
            const matchingBC = caseStudiesBC.find(csb => csb.cs_id === cs.case_study_id && csb.bc_id === 2);
            return { ...cs, Visibility: matchingBC.Visibility };
        })

        const mappedCaseStudies = filteredCaseStudies?.map((caseStudy: CaseStudy) => {
            return this.caseStudyMapper?.map(
                caseStudy,
                caseStudyFeatures.filter((caseStudyFeature: CaseStudyFeature) => caseStudyFeature.case_study_id === caseStudy.case_study_id),
                caseStudyProducts.filter((caseStudyProduct: CaseStudyProduct) => caseStudyProduct.cs_id === caseStudy.case_study_id),
                caseStudySegments.filter((caseStudySegment: CaseStudySegment) => caseStudySegment.case_study_id === caseStudy.case_study_id)
            );
        });

        const entries = [
            // ...mappedIndustries ?? [],
            // ...mappedSegments ?? [],
            // ...mappedForms ?? [],
            // ...mappedProducers ?? [],
            // ...mappedCountries ?? [],
            // ...mappedFeatures ?? [],
            // ...mappedSpecification ?? [],
            // ...mappedFillers ?? [],
            // ...mappedProcesses ?? [],
            // ...mappedQualities ?? [],
            // ...mappedPolymerFamily ?? [],
            // ...mappedPolymerGroups ?? [],
            // ...mappedPolymerSubgroups ?? [],
            // ...mappedBrands ?? [],
            // ...mappedProductFillers ?? [],
            ...mappedProducts ?? [],
            // ...mappedCaseStudies ?? []
        ];
        return {
            "tags": [],
            "entries": entries,
            "assets": []
        };
    }
}
