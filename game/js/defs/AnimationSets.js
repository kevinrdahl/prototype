var AnimationSets = {};

AnimationSets.applyToEntity = function(entity, animationSet) {
   var sprite = entity.sprite;
   var animName, animation, dirName, direction, fullName;

   entity.animationSet = animationSet;

   for (animName in animationSet) {
      animation = animationSet[animName];
      for (dirName in animation.directions) {
         fullName = animName + '_' + dirName;
         direction = animation.directions[dirName];
         sprite.animations.add(fullName, direction.frames, animation.frameRate, animation.loop);
      }
   }
}

AnimationSets['up4_side4_down4'] = {
   idle:{
      directions:{
         up:{frames:[0,1]},
         right:{frames:[4,5]},
         left:{frames:[4,5], flipX:true},
         down:{frames:[8,9]}
      },
      frameRate:2,
      defaultDirection:"down",
      loop:true
   },

   walk:{
      directions:{
         up:{frames:[0,1,2,3]},
         right:{frames:[4,5,6,7]},
         left:{frames:[4,5,6,7], flipX:true},
         down:{frames:[8,9,10,11]}
      },
      frameRate:15,
      defaultDirection:"down",
      loop:true
   }
}
