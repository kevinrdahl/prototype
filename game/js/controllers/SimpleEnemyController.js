var SimpleEnemyController = Class(Controller, {
	constructor: function(entity) {
		SimpleEnemyController.$super.call(this, entity);
		
		this.fireRange = entity.abilities.primary.aiAttackRange;
		this.followDistance = this.fireRange - 100;
		this.runAwayDistance = this.followDistance/3;
		this.aggroDistance = 500;
		this.aggroDropDistance = 750;
		this.aggroTarget = null;
		this.aggroTime = 0;
		this.aggroMinTime = 1500;
		
		this.fireInterval = entity.abilities.primary.cooldown * 1.5;
		this.fireIntervalVariance = this.fireInterval/3;
		this.fireCooldown = 0;
	},
	
	update: function() {
		SimpleEnemyController.$superp.update.call(this);
		
		this.fireCooldown = Math.max(0, this.fireCooldown - gameState.updateTimeDelta);
		
		this.updateDistToPlayer();
		this.updateAggro();
		
		if (this.aggroTarget && this.aggroTarget.alive) {
			if (this.distToPlayer < this.runAwayDistance) this.moveAwayFromPoint(gameState.playerEntity.sprite.position);
			else if (this.distToPlayer > this.followDistance) this.moveToPoint(gameState.playerEntity.sprite.position);
			
			if (this.distToPlayer <= this.fireRange && this.fireCooldown <= 0) {
				this.aimAtTarget(gameState.playerEntity, Phaser.Math.degToRad(10));
				this.useAbilities.primary = true;
				
				this.fireCooldown = this.fireInterval + Utils.vary(this.fireIntervalVariance);
			}
		} else if (this.direction.getMagnitude() != 0) {
			this.direction = new Phaser.Point(0,0);
		}
		
		//this.direction.setMagnitude(0.5);
	},
	
	updateAggro: function() {
		if (!this.aggroTarget) {
			if (this.distToPlayer <= this.aggroDistance) this.aggroTarget = gameState.playerEntity;
		} else if (this.distToPlayer >= this.aggroDropDistance && gameState.timeSince(this.aggroTime) > this.aggroMinTime) {
			this.aggroTarget = null;
		}
	},
	
	updateDistToPlayer: function() {
		this.distToPlayer = this.entity.sprite.position.distance(gameState.playerEntity.sprite.position);
	},
	
	aggro: function(target) {
		this.aggroTarget = target;
		this.aggroTime = gameState.currentTime;
	},
	
	onTakeDamage: function(amount, sourceEntity) {
		this.aggro(sourceEntity);
	}
});