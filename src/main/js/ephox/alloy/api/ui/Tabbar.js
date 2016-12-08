define(
  'ephox.alloy.api.ui.Tabbar',

  [
    'ephox.alloy.api.SystemEvents',
    'ephox.alloy.api.behaviour.BehaviourExport',
    'ephox.alloy.api.behaviour.Highlighting',
    'ephox.alloy.api.ui.CompositeBuilder',
    'ephox.alloy.api.ui.TabButton',
    'ephox.alloy.data.Fields',
    'ephox.alloy.dom.DomModification',
    'ephox.alloy.parts.PartType',
    'ephox.alloy.ui.composite.TabbarSpec',
    'ephox.boulder.api.FieldSchema',
    'ephox.peanut.Fun'
  ],

  function (SystemEvents, BehaviourExport, Highlighting, CompositeBuilder, TabButton, Fields, DomModification, PartType, TabbarSpec, FieldSchema, Fun) {
    var schema = [
      FieldSchema.strict('tabs'),

      FieldSchema.defaulted('onDismiss', Fun.noop),
      FieldSchema.defaulted('onChange', Fun.noop),
      FieldSchema.strict('dom'),

      Fields.members([ 'tab' ]),

      FieldSchema.defaulted('clickToDismiss', false),

      Fields.markers([ 'tabClass', 'selectedClass' ])
    ];


    var tabsPart = PartType.group(
      TabButton,
      'tabs',
      'tab',
      '<alloy.tabs>',
      Fun.constant({ }),
      function (barDetail, tabSpec) {
        var dismissTab = function (tabbar, button) {
          Highlighting.dehighlight(tabbar);
          tabbar.getSystem().triggerEvent(SystemEvents.dismissTab(), tabbar.element(), {
            tabbar: Fun.constant(tabbar),
            button: Fun.constant(button)
          });
        };

        var changeTab = function (tabbar, button) {
          Highlighting.highlight(tabbar, button);
          tabbar.getSystem().triggerEvent(SystemEvents.changeTab(), tabbar.element(), {
            tabbar: Fun.constant(tabbar),
            button: Fun.constant(button)
          });
        };

        return {
          behaviours: {
            representing: {
              initialValue: tabSpec.value
            },
            'tabbar.tabbuttons': { }
          },
          action: function (button) {
            var tabbar = button.getSystem().getByUid(barDetail.uid()).getOrDie();
            var activeButton = Highlighting.isHighlighted(tabbar, button);

            var response = (function () {
              if (activeButton && barDetail.clickToDismiss()) return dismissTab;
              else if (! activeButton) return changeTab;
              else return Fun.noop;
            })();

            response(tabbar, button);
          },

          customBehaviours: [
            // TODO: Add highlighting tab class.
            BehaviourExport.santa([ ], 'tabbar.tabbuttons', {
              exhibit: function (base, info) {
                return DomModification.nu({
                  classes: [ barDetail.markers().tabClass() ]
                });
              }
            }, {


            }, { })
          ]
        };
      }
    );
  
    var partTypes = [
      tabsPart
    ];

    var build = function (spec) {
      return CompositeBuilder.build('tab-bar', schema, partTypes, TabbarSpec.make, spec);
    };

    // TODO: Remove likely dupe
    var parts = PartType.generate('tab-bar', partTypes);

    return {
      build: build,
      parts: Fun.constant(parts)


    };
  }
);