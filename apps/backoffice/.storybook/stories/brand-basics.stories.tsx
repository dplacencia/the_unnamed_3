import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useTranslations } from "next-intl";
import { useId, useState, type CSSProperties } from "react";
import { Badge } from "../../src/components/ui/badge";
import { Button } from "../../src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../src/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "../../src/components/ui/field";
import { Input } from "../../src/components/ui/input";
import "./brand-basics.css";

const fonts = [
  {
    id: "source-sans",
    name: "Source Sans 3",
    family: '"Proposal Source Sans 3", sans-serif',
    description: "brandFontSource",
  },
  {
    id: "inter",
    name: "Inter",
    family: '"Proposal Inter", sans-serif',
    description: "brandFontInter",
  },
  {
    id: "outfit",
    name: "Outfit",
    family: '"Outfit", sans-serif',
    description: "brandFontOutfit",
  },
] as const;
type FontId = (typeof fonts)[number]["id"];
const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const palettes = [
  {
    id: "indigo",
    code: "D",
    label: "brandIndigo",
    isNew: true,
    colours: [
      "#F5F3FA",
      "#EAE6F3",
      "#D4CDEA",
      "#B4ACD7",
      "#8D83BB",
      "#57528C",
      "#464174",
      "#39365F",
      "#302E4F",
      "#292842",
      "#19182B",
    ],
  },
  {
    id: "plum",
    code: "E",
    label: "brandPlum",
    isNew: true,
    colours: [
      "#FAF3F6",
      "#F1E4EB",
      "#E4CAD8",
      "#CEA4BA",
      "#AF7F99",
      "#80516B",
      "#694156",
      "#563748",
      "#482F3D",
      "#3D2934",
      "#25181F",
    ],
  },
  {
    id: "graphite",
    code: "F",
    label: "brandGraphite",
    isNew: true,
    colours: [
      "#F3F5F6",
      "#E5EAEC",
      "#CCD4D9",
      "#ABB8BF",
      "#81949E",
      "#4E5B62",
      "#404C52",
      "#354147",
      "#2D373C",
      "#273034",
      "#161D21",
    ],
  },
  {
    id: "teal",
    code: "A",
    label: "brandTeal",
    isNew: false,
    colours: [
      "#EDF7F3",
      "#D8ECE4",
      "#B3D8CB",
      "#85BDAA",
      "#4D9983",
      "#1D7567",
      "#155D53",
      "#144A43",
      "#153C37",
      "#15322F",
      "#0A211E",
    ],
  },
  {
    id: "blue",
    code: "B",
    label: "brandBlue",
    isNew: false,
    colours: [
      "#F0F5FA",
      "#DEE9F3",
      "#BED3E5",
      "#98B8D3",
      "#6A94B7",
      "#355E83",
      "#2D4E6D",
      "#2A425B",
      "#26374B",
      "#232F3E",
      "#151E29",
    ],
  },
  {
    id: "copper",
    code: "C",
    label: "brandCopper",
    isNew: false,
    colours: [
      "#FBF4EE",
      "#F3E5D7",
      "#E7CBB1",
      "#D7A987",
      "#BD815A",
      "#965637",
      "#7C432D",
      "#633728",
      "#512F25",
      "#442A23",
      "#281710",
    ],
  },
] as const;

function BrandComparison() {
  const t = useTranslations("catalogue");
  const id = useId();
  const [font, setFont] = useState<FontId>("source-sans");
  const selected = fonts.find((item) => item.id === font)!;
  return (
    <section
      className="brand-study"
      data-brand-proposals
      data-preview-font={font}
      style={
        {
          fontFamily: selected.family,
          "--font-source-sans-3": selected.family,
        } as CSSProperties
      }
    >
      <div className="brand-study-inner">
        <header className="brand-study-header">
          <p className="brand-study-eyebrow">{t("brandEyebrow")}</p>
          <h1>{t("brandTitle")}</h1>
          <p>{t("brandIntro")}</p>
          <p className="brand-study-notice">{t("brandNotice")}</p>
        </header>

        <fieldset className="brand-study-fonts">
          <legend>{t("brandFontTitle")}</legend>
          <p className="brand-study-helper">{t("brandFontHint")}</p>
          <div className="brand-study-font-grid">
            {fonts.map((item) => (
              <label
                key={item.id}
                className="brand-study-font-option"
                style={{ fontFamily: item.family }}
              >
                <div className="brand-study-font-option-heading">
                  <input
                    type="radio"
                    aria-label={item.name}
                    name={`${id}-font`}
                    value={item.id}
                    checked={font === item.id}
                    onChange={() => setFont(item.id)}
                  />
                  <span>{item.name}</span>
                  {item.id === "source-sans" && (
                    <span className="brand-study-tag">
                      {t("brandRecommended")}
                    </span>
                  )}
                </div>
                <span className="brand-study-font-specimen">
                  Irin · Aa 0123
                </span>
                <span className="brand-study-helper">
                  {t(item.description)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <section
          aria-labelledby={`${id}-accents`}
          className="brand-study-accents"
        >
          <div className="brand-study-section-heading">
            <h2 id={`${id}-accents`}>{t("brandAccentTitle")}</h2>
            <p className="brand-study-helper">
              {t("brandCurrentFont", { font: selected.name })}
            </p>
          </div>
          <div className="brand-study-palette-grid">
            {palettes.map((palette) => {
              const fieldId = `${id}-${palette.id}`;
              const style = Object.fromEntries(
                palette.colours.map((colour, index) => [
                  `--color-brand-${steps[index]}`,
                  colour,
                ]),
              ) as CSSProperties;
              return (
                <Card
                  key={palette.id}
                  className="brand-study-palette"
                  data-palette={palette.id}
                  style={style}
                >
                  <CardHeader>
                    <div className="brand-study-palette-heading">
                      <span className="brand-study-code">{palette.code}</span>
                      <CardTitle>
                        <h3>{t(palette.label)}</h3>
                      </CardTitle>
                      {palette.isNew && (
                        <span className="brand-study-tag">
                          {t("brandNewOption")}
                        </span>
                      )}
                    </div>
                    <p className="brand-study-helper">
                      {t("brandAccentCode", { colour: palette.colours[5] })}
                    </p>
                  </CardHeader>
                  <CardContent className="brand-study-sample">
                    <div>
                      <p className="brand-study-wordmark">Irin</p>
                      <p className="brand-study-helper">
                        {t("brandWorkingName")}
                      </p>
                    </div>
                    <div className="brand-study-type-sample">
                      <h4>{t("brandSampleHeading")}</h4>
                      <p>{t("compositionReview")}</p>
                    </div>
                    <Field controlId={fieldId}>
                      <FieldLabel>{t("brandSampleField")}</FieldLabel>
                      <Input defaultValue="1234.5000" data-brand-input />
                      <FieldDescription>{t("brandFieldHint")}</FieldDescription>
                    </Field>
                    <div className="brand-study-actions">
                      <Button type="button" data-brand-primary>
                        {t("brandSampleAction")}
                      </Button>
                      <Button type="button" variant="outline">
                        {t("brandSecondaryAction")}
                      </Button>
                    </div>
                    <div className="brand-study-status">
                      <span>{t("brandStatusLabel")}</span>
                      <Badge color="gray" size="sm">
                        {t("brandStatusValue")}
                      </Badge>
                    </div>
                    <div className="brand-study-swatches" aria-hidden="true">
                      {[0, 1, 3, 5, 7, 9].map((index) => (
                        <span
                          key={index}
                          style={{ background: palette.colours[index] }}
                        />
                      ))}
                    </div>
                    <p className="brand-study-glyphs">
                      ÁÉÍÓÚ · àèéíïòóúü · ñ ç l·l · 0O 1Il
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
        <p className="brand-study-footer">{t("brandChoiceHint")}</p>
      </div>
    </section>
  );
}

const meta = {
  title: "Brand/Explorations",
  parameters: {
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Development-only comparisons using actual TailAdmin components. D/ink indigo and Source Sans 3 are selected for the first backoffice; other options remain references.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basics: Story = { render: () => <BrandComparison /> };
