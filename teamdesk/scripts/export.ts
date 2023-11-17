import { ExportService } from '../services/export.service';
import { readJsonFileFromPath } from '../../util/filesystem.util';
import { Endpoint } from "../models/dev/endpoint";
import {OptionValues} from "commander";
const { program } = require('commander');


main();

function main(): void {
    const options = parseOptions();
    exportData(options);
}

function parseOptions(): OptionValues {
    program
        .option('-c, --config <config>', 'export config')
        .option('-bc, --business-context <businessContext>', 'Business Context')
        .option('-a, --api-key <apiKey>', 'TeamDesk api key')
        .option('-sd, --sync-dir <apiKey>', 'Directory to sync data to ex.: "sync/exports/"');

    program.parse(process.argv);
    const options = program.opts() as OptionValues;

    validateOptions(options);
    return options;
}

function validateOptions(options: OptionValues): void {
    if (!options.config) throw new Error('A export config is required');
    if (!options.businessContext) throw new Error('A business context is required');
    if (!options.apiKey) throw new Error('A TeamDesk api key is required');
    if (!options.syncDir) throw new Error('A sync directory is required');
}

function exportData(options: OptionValues): void {
    const filename = 'data.json';
    const backupFilename = 'data.old.json';
    const diffFilename = 'data.diff.json';

    const config = readJsonFileFromPath(options.config);
    const exportService = new ExportService(options.apiKey);
    let promise = Promise.resolve();

    config.endpoints.forEach((endpoint: Endpoint) => {
        promise = promise.then(function () {
            return new Promise(function (resolve) {
                exportService.toJson({
                    url: exportService.generateUrl(config.host, endpoint.url, options.businessContext),
                    directory: `sync/exports/${endpoint.resource.toLowerCase()}`,
                    filename,
                    backupFilename,
                    diffFilename
                });
                setTimeout(resolve, 2500);
            });
        });
    });
}
