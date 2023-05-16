import { Document, Schema, Types, model } from "mongoose";

interface ModelDef {
  _id?: Types.ObjectId;
  name: string;
  price: number;
  promotion: number;
  images: string;
}

interface TierVariation {
  name: string;
  options: string[];
  images: string[];
}

interface ItemRating {
  rating_count: number[];
  rating_star: number;
}

// interface VideoInfo {
//   _id?: Types.ObjectId;
//   thumb_url: string;
// }

interface ProductDef {
  _id?: Types.ObjectId;
  category: Types.ObjectId;
  name: string;
  price: number;
  images: string[];
  description: string;
  thumb_url: string;
  models: ModelDef[];
  price_before_discount: number;
  price_max: number;
  price_max_before_discount: number;
  price_min: number;
  price_min_before_discount: number;
  raw_discount: number;
  tier_variations: TierVariation[];
  item_rating: ItemRating;
  // video_info_list: VideoInfo[];
}

const productSchema = new Schema<ProductDef>({
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: ""
  },
  name: {
    type: String,
    default: "",
    index: true
  },
  price: {
    type: Number,
    default: 0
  },
  thumb_url: {
    type: String,
    default: "https://alxgroup.com.au/wp-content/uploads/2016/04/dummy-post-horisontal.jpg"
  },
  description: {
    type: String,
    default: ""
  },
  images: [
    {
      type: String
    }
  ],
  models: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        required: true,
        auto: true
      },
      name: {
        type: String,
        index: true,
        default: ""
      },
      price: {
        type: Number,
        default: 0
      },
      promotion: {
        type: Number,
        default: 0
      },
      images: {
        type: String,
        default: ""
      }
    }
  ],
  price_before_discount: {
    type: Number,
    default: 0
  },
  price_max: {
    type: Number,
    default: 0
  },
  price_max_before_discount: {
    type: Number,
    default: 0
  },
  price_min: {
    type: Number,
    default: 0
  },
  price_min_before_discount: {
    type: Number,
    default: 0
  },
  raw_discount: {
    type: Number,
    default: 0
  },
  tier_variations: [
    {
      name: {
        type: String,
        default: ""
      },
      options: [
        {
          type: String
        }
      ],
      images: [
        {
          type: String
        }
      ]
    }
  ],
  item_rating: {
    rating_count: [
      {
        type: Number
      }
    ],
    rating_star: {
      type: Number
    }
  }
  // video_info_list: [
  //   {
  //     _id: Schema.Types.ObjectId,
  //     thumb_url: {
  //       type: String,
  //     },
  //   },
  // ],
});

productSchema.index({ name: "text" });

export const ProductModel = model<ProductDef>("Product", productSchema);
export type ProductDocument = Document<unknown, any, ProductDef> &
  ProductDef & {
    _id: Types.ObjectId;
  };
