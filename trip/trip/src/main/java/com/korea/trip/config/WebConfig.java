package com.korea.trip.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/**").addResourceLocations("classpath:/static/").resourceChain(true)
				.addResolver(new PathResourceResolver() {
					@Override
					protected Resource getResource(String resourcePath, Resource location) throws IOException {
						Resource requestedResource = location.createRelative(resourcePath);
						return requestedResource.exists() && requestedResource.isReadable() ? requestedResource
								: new ClassPathResource("/static/index.html");
					}
				});
	}

	@Override
	public void addCorsMappings(CorsRegistry registry) { // 이 메서드 추가
		registry.addMapping("/**") // 모든 경로에 대해 CORS 허용
				.allowedOrigins("http://localhost:3000", "http://frontend-env.eba-b7dqgfmm.ap-northeast-2.elasticbeanstalk.com", "http://frontend-developer-env.eba-ehhibcmu.ap-northeast-2.elasticbeanstalk.com") // 프론트엔드 도메인 명시
				.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP
				.allowedHeaders("*") // 모든 헤더 허용
				.allowCredentials(true); // 자격 증명(쿠키, HTTP 인증) 허용
	}
}
