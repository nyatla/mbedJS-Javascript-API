(function(){
	mbedAppBoard={};
	/**
	 * @private
	 * p28,p27で構成される共通I2cバスを取得します。
	 */
	mbedAppBoard._getI2C=function mbedAppBoard__getI2C(i_parent,i_cb)
	{
		if(!i_parent.__mbedappboard_i2c){
			i_parent.__mbedappboard_i2c_ref=1;
			i_parent.__mbedappboard_i2c=new mbedJS.I2C(i_parent,[mbedJS.PinName.p28,mbedJS.PinName.p27],function(){
				i_parent.__mbedappboard_i2c.frequency(100000,function(){
					i_cb(i_parent.__mbedappboard_i2c);
				});
			});
		}else{
			i_parent.__mbedappboard_i2c_ref++;
			setTimeout(function(){i_cb(i_parent.__mbedappboard_i2c)},0);
		}
	}
	/**
	 * @private
	 * p28,p27で構成される共通I2cバスを解放します。
	 */
	mbedAppBoard._releaseI2C=function mbedAppBoard__releaseI2C(i_parent,i_cb)
	{
		i_parent.__mbedappboard_i2c_ref--;
		if(i_parent.__mbedappboard_i2c_ref<1){
			alert("delete");
			i_parent.__mbedappboard_i2c.dispose(i_cb);
		}else{
			setTimeout(function(){i_cb();},0);
		}
	}	
}());