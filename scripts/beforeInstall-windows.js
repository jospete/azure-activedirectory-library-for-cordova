#!/usr/bin/env node

var path = require('path');
var plugman = require('plugman');

// Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.

module.exports = function (ctx) {

    // Processing USE_CORPORATE_NETWORK plugin variable
    var useCorporateNetwork = false;

    var re = /--variable ADAL_USE_CORPORATE_NETWORK=(.+)/i;
    var result = re.exec(ctx.cmdLine);
    if(result !== null) {
        var match = result[1];

        useCorporateNetwork = match.toUpperCase() === 'TRUE';
    }

    console.log('useCorporateNetwork: ' + useCorporateNetwork);

    if (useCorporateNetwork === true) {
        var plugmanInstallOpts = {
            plugins_dir: path.join(ctx.opts.projectRoot, 'plugins'),
            platform: 'windows',
            project: path.join(ctx.opts.projectRoot, 'platforms', 'windows')
        };

        var ssoPluginPath = path.join(ctx.opts.projectRoot, 'plugins/cordova-plugin-ms-adal/src/windows/sso');

        plugman.install(plugmanInstallOpts.platform, plugmanInstallOpts.project, 
            ssoPluginPath, plugmanInstallOpts.plugins_dir);
    }
};
