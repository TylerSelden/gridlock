import * as THREE from "three";

export function VolumetricSpotLightMaterial() {
	// 
	var vertexShader	= [
		'varying vec3 vNormal;',
		'varying vec3 vWorldPosition;',
		
		'void main(){',
			'// compute intensity',
			'vNormal		= normalize( normalMatrix * normal );',

			'vec4 worldPosition	= modelMatrix * vec4( position, 1.0 );',
			'vWorldPosition		= worldPosition.xyz;',

			'// set gl_Position',
			'gl_Position	= projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
		'}',
	].join('\n')
	var fragmentShader	= [
		'varying vec3		vNormal;',
		'varying vec3		vWorldPosition;',

		'uniform vec3		lightColor;',

		'uniform vec3		spotPosition;',

		'uniform float		attenuation;',
		'uniform float		anglePower;',

		'void main(){',
			'float intensity;',

			'intensity	= distance(vWorldPosition, spotPosition)/attenuation;',
			'intensity	= 1.0 - clamp(intensity, 0.0, 1.0);',

			'vec3 normal	= vec3(vNormal.x, vNormal.y, abs(vNormal.z));',
			'float angleIntensity	= pow( dot(normal, vec3(0.0, 0.0, 1.0)), anglePower );',
			'intensity	= intensity * angleIntensity;',		

			'gl_FragColor	= vec4( lightColor, intensity);',
		'}',
	].join('\n')

	var material	= new THREE.ShaderMaterial({
		uniforms: { 
			attenuation	: {
				type	: "f",
				value	: 11
			},
			anglePower	: {
				type	: "f",
				value	: 4
			},
			spotPosition		: {
				type	: "v3",
				value	: new THREE.Vector3( 0, 0, 0 )
			},
			lightColor	: {
				type	: "c",
				value	: new THREE.Color('white')
			},
		},
		vertexShader	: vertexShader,
		fragmentShader	: fragmentShader,
		transparent	: true,
		depthWrite	: false,
	});
	return material
}

