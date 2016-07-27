var AnimationSets = {};

AnimationSets.applyToObject = function(obj, animationSet) {
   var sprite = obj.sprite;
   var animName, animation, dirName, direction, fullName;

   obj.animationSet = animationSet;

   for (animName in animationSet) {
      animation = animationSet[animName];
      for (dirName in animation.directions) {
         fullName = animName + '_' + dirName;
         direction = animation.directions[dirName];
         sprite.animations.add(fullName, direction.frames, animation.frameRate, animation.loop);
      }
   }
}

AnimationSets.setObjectAnimation = function(obj, animation, direction, force) {
   var animDef = obj.animationSet[animation];
   if (!animDef || !animDef.directions) return;

   var dirDef = animDef.directions[direction];
   if (!dirDef) {
      direction = animDef.defaultDirection;
      dirDef = animDef.directions[direction];
      if (!dirDef) return;
   }

   var animName = animation + "_" + direction;

   if (obj.sprite.animations.currentAnim.name != animName || force) {
      obj.sprite.animations.play(animName);
   }

   if (dirDef.flipX) obj.sprite.scale.x = -4;
   else obj.sprite.scale.x = 4;

   if (dirDef.flipY) obj.sprite.scale.y = -4;
   else obj.sprite.scale.y = 4;
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
      defaultDirection:'down',
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
      defaultDirection:'down',
      loop:true
   }
}

//things that just spin
AnimationSets['rot4'] = {
	idle:{
		directions:{
			down:{frames:[0,1,2,3]}
		},
		frameRate:15,
		defaultDirection:'down',
		loop:true
	}
}