import bcrypt from 'bcrypt-nodejs';
import mongoose from 'mongoose';

export type IUser = mongoose.Document & {
  email: string;
  password: string;
  accessToken: string;
  slackID: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  role: string;

  profile: {
    name: string;
    gender: string;
    location: string;
    website: string;
    img: string;
  };
  cards: string[];
};

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: '{PATH} is required!'
  },
  password: {
    type: String,
    required: '{PATH} is required!',
    select: false
  },
  slackID: String,
  accessToken: {
    type: String,
    select: false
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  role: {
    type: String,
    default: 'CLIENT'
  },

  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    img: String
  },

  cards: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card'
    }],
    select: false
  }
}, {
  // toObject: {
  //   virtuals: true
  // },
  // toJSON: {
  //   virtuals: true
  // },
  versionKey: false,
  timestamps: true
});

// userSchema.virtual('followersCount', {
//   ref: 'User',
//   localField: 'followers',
//   foreignField: '_id',
//   count: true
// });


/**
 * Password hash middleware.
 */
userSchema.pre('save', async function (next) {
  const user = this as IUser;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
//   bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
//     cb(err, isMatch);
//   });
// };

// userSchema.methods.comparePassword = comparePassword;

export const User = mongoose.model<IUser>('User', userSchema);