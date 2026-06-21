package com.ravyn.chat.auth;

import com.ravyn.chat.user.ChatUser;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthSessionService {
    private final HttpServletRequest request;

    public AuthSessionService(HttpServletRequest request) {
        this.request = request;
    }

    public void establishSessionForUser(ChatUser user){
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        new AuthenticatedUser(user.getId(), user.getUsername()),
                        null,
                        List.of()
                );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        request.getSession(true)
                .setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
    }
}
