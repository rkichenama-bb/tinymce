define(
  'ephox.alloy.spec.DropdownWidgetSpec',

  [
    'ephox.alloy.dropdown.Beta',
    'ephox.alloy.dropdown.DropdownBehaviour',
    'ephox.alloy.dropdown.Gamma',
    'ephox.alloy.menu.logic.ViewTypes',
    'ephox.alloy.spec.ButtonSpec',
    'ephox.alloy.spec.SpecSchema',
    'ephox.alloy.spec.UiSubstitutes',
    'ephox.boulder.api.FieldSchema',
    'ephox.highway.Merger',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option'
  ],

  function (Beta, DropdownBehaviour, Gamma, ViewTypes, ButtonSpec, SpecSchema, UiSubstitutes, FieldSchema, Merger, Fun, Option) {
    // DUPE:
    var schema = [
      FieldSchema.strict('fetch'),
      FieldSchema.defaulted('onOpen', Fun.noop),
      FieldSchema.defaulted('onExecute', Option.none),
      FieldSchema.defaulted('toggleClass', 'alloy-selected-button'),
      FieldSchema.strict('dom'),
      FieldSchema.option('sink'),
      ViewTypes.schema()
    ];

    var make = function (spec) {
      var detail = SpecSchema.asStructOrDie('dropdown.widget', schema, Merger.deepMerge(spec, {
        view: ViewTypes.useWidget(spec)
      }), Gamma.parts());

      var beta = Beta(detail);

      var factories = Merger.deepMerge(
        {
          '<alloy.sink>': beta.makeSink
        },
        Gamma.display()
      );

      var components = UiSubstitutes.substitutePlaces(Option.none(), detail, detail.components(), { }, factories);

      return Merger.deepMerge(
        ButtonSpec.make({
          uid: detail.uid(),
          action: beta.togglePopup
        }),
        {
          uid: detail.uid(),
          uiType: 'button',
          dom: detail.dom(),
          components: components,
          toggling: {
            toggleClass: detail.toggleClass(),
            aria: {
              'aria-expanded-attr': 'aria-expanded'
            }
          },
          eventOrder: {
            // Order, the button state is toggled first, so assumed !selected means close.
            'alloy.execute': [ 'toggling', 'alloy.base.behaviour' ]
          },
          coupling: {
            others: {
              sandbox: beta.makeSandbox
            }
          },
          behaviours: [
            DropdownBehaviour(detail.partUids().display)
          ],
          keying: {
            mode: 'execution',
            useSpace: true
          },
          focusing: true
        }
      );
    };

    return {
      make: make
    };
  }
);