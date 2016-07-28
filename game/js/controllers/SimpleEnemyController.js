var SimpleEnemyController = Class(Controller, {
	constructor: function(entity) {
		SimpleEnemyController.$super.call(this, entity);
		
		this.fireRange = entity.abilities.primary.aiAttackRange;
		this.followDistance = this.fireRange - 100;
		this.runAwayDistance = this.followDistance/3;
		this.aggroDistance = 500;
		this.aggroDropDistance = 750;
		this.aggroTarget = null;
		
		this.fireInterval = entity.abilities.primary.cooldown * 1.5;
		this.fireIntervalVariance = this.fireInterval/3;
		this.fireCooldown = 0;
	},
	
	update: function() {
		SimpleEnemyController.$superp.update.call(this);
		
		this.fireCooldown = Math.max(0, this.fireCooldown - gameState.updateTimeDelta);
		
		var distToPlayer = this.entity.sprite.position.distance(gameState.playerEntity.sprite.position);
		
		if (!this.aggroTarget) {
			if (distToPlayer <= this.aggroDistance) this.aggroTarget = gameState.playerEntity;
		} else if (distToPlayer >= this.aggroDropDistance) {
			this.aggroTarget = null;
		}
		
		if (this.aggroTarget && this.aggroTarget.alive) {
			if (distToPlayer < this.runAwayDistance) this.moveAwayFromPoint(gameState.playerEntity.sprite.position);
			else if (distToPlayer > this.followDistance) this.moveToPoint(gameState.playerEntity.sprite.position);
			
			if (distToPlayer <= this.fireRange && this.fireCooldown <= 0) {
				this.aimAtTarget(gameState.playerEntity, Phaser.Math.degToRad(10));
				this.useAbilities.primary = true;
				
				this.fireCooldown = this.fireInterval + Utils.vary(this.fireIntervalVariance);
			}
		} else if (this.direction.getMagnitude() != 0) {
			this.direction = new Phaser.Point(0,0);
		}
	}
});