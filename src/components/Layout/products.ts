import { iconQuery, iconSpectron } from "@surrealdb/ui";
import DocsDark from "~/assets/img/logo/dark/docs.svg";
import SpectronDark from "~/assets/img/logo/dark/spectron.svg";
import LogoDark from "~/assets/img/logo/dark/surrealdb.svg";
import DocsLight from "~/assets/img/logo/light/docs.svg";
import SpectronLight from "~/assets/img/logo/light/spectron.svg";
import LogoLight from "~/assets/img/logo/light/surrealdb.svg";
import {
    PRODUCT_META,
    PRODUCT_ORDER as PRODUCT_ORDER_META,
    type ProductId,
    type ProductMeta,
} from "~/utils/product";

export type { ProductId } from "~/utils/product";
export { getProductFromPath } from "~/utils/product";

export const PRODUCT_ORDER: ProductId[] = [...PRODUCT_ORDER_META];

/**
 * Visual identity for a product. Navigation lives separately in
 * `nav.ts` and is passed in by each `+Layout.tsx`, so this config
 * stays focused on branding (icon, wordmark, label, home link).
 */
export interface ProductConfig extends ProductMeta {
    icon: string;
    wordmarkLight: string;
    wordmarkDark: string;
}

export const PRODUCTS: Record<ProductId, ProductConfig> = {
    surrealdb: {
        ...PRODUCT_META.surrealdb,
        icon: iconQuery,
        wordmarkLight: DocsLight,
        wordmarkDark: DocsDark,
    },
    spectron: {
        ...PRODUCT_META.spectron,
        icon: iconSpectron,
        wordmarkLight: SpectronLight,
        wordmarkDark: SpectronDark,
    },
};

export const SURREALDB_LOGO_LIGHT = LogoLight;
export const SURREALDB_LOGO_DARK = LogoDark;
