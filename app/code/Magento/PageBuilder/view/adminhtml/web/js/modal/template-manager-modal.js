/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'Magento_Ui/js/modal/modal-component',
    'Magento_PageBuilder/js/events',
    'underscore',
    'Magento_PageBuilder/js/stage-builder',
    'uiRegistry'
], function ($, ModalComponent, events, _, stageBuilder, registry) {
    'use strict';

    return ModalComponent.extend({
        defaults: {
            stage: null,
            modules: {
                messageContainer: '${ $.messageContainerProvider }',
                listing: '${ $.listingProvider }'
            }
        },

        /** @inheritdoc */
        initialize: function () {
            this._super();
            _.bindAll(this, 'closeModal');

            events.on('stage:templateManager:open', function (params) {
                this.openModal();
                this.stage = params.stage;
            }.bind(this));

            return this;
        },

        /**
         * Apply selected template
         *
         * @param {String} template
         */
        applySelected: function (template) {
            if (template) {
                this.stage.rootContainer.children([]);
                $('body').trigger('processStart');

                stageBuilder(this.stage, template).then(function () {
                    // Remove selection from grid
                    registry.get('pagebuilder_stage_template_grid.pagebuilder_stage_template_grid.columns.ids')
                        .select(null);
                    $('body').trigger('processStop');
                    this.closeModal();
                }.bind(this));
            }
        }
    });
});
